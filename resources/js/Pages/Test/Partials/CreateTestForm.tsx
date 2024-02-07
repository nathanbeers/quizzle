import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import Button from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import FieldWrapper from '@/Components/ui/FieldWrapper';
import Loading from '@/Components/ui/Loading';
import axios from 'axios';
import Textarea from '@/Components/ui/Textarea';
import { Modal, Card, Tooltip } from 'flowbite-react';
import type { QuestionForm } from '@/types/test';
import { extractStringValues } from '@/helpers';
import { v4 as uuidv4 } from 'uuid';
import { RadioGroup, Radio } from '@/Components/ui/RadioGroup';
import { CheckboxGroup, Checkbox} from '@/Components/ui/CheckboxGroup';
import QuestionCircle from '@/Components/ui/icons/QuestionCircle';

type Inputs = {
  title: string;
  description: string;
  tags: { tag: string }[];
  questions: QuestionForm[];
}

export default function CreateTestForm({ userID }: { userID: number }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<string[]>([])
    const [questionFormErrors, setquestionFormErrors] = useState<string[]>([])
    const [openQuestionModal, setopenQuestionModal] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        control,
        getValues,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tags",
    });

    const watchQuestionField = watch('questions');

    useEffect(() => {
        const subscription = watch((value, { name, type }) =>
            console.log(value, name, type)
        )
        return () => subscription.unsubscribe()
    }, [watchQuestionField])

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setIsLoading(true);
        const tags = data.tags.filter(tag => !!tag.tag)
        const formData = {
            ...data,
            user_id: userID,
            tags: JSON.stringify(tags)
        }

        console.log(formData);

        try {
            const res = await axios.post(route('tests.store'), formData);
            setFormErrors([]);
            console.log(res);
        } catch (error: any) {
            console.log(error);

            setFormErrors(extractStringValues(JSON.parse(error.request?.responseText || {})));
        } finally {
            setIsLoading(false);
        }
    }

    const handleAddQuestion = () => {
        console.log(getValues('questions'));
        if (getValues('questions')) {
            setValue('questions', [...getValues('questions'), {
                question_id: `${userID}${uuidv4()}`,
                title: '',
                type: 'Multiple Choice',
                choices: [],
                answer: '',
                description: '',
                autoGrade: 'yes',
                saved: false,
            }]);
        }
        else {
            setValue('questions', [{
                question_id: `${userID}${uuidv4()}`,
                title: '',
                type: 'Multiple Choice',
                choices: [],
                answer: '',
                description: '',
                autoGrade: 'yes',
                saved: false,
            }]);
        }
        setopenQuestionModal(true);
    };

    const handleRemoveQuestion = (index: number) => {
        const newQuestions = getValues('questions').filter((_, i) => i !== index);
        setValue('questions', newQuestions);
        setopenQuestionModal(false);
        setquestionFormErrors([]);
    };

    const handleSaveQuestion = (index: number, question: QuestionForm) => {
        const allQuestions = getValues('questions');
        allQuestions[index] = question;

        if (!isQuestionFormValid(index, question)) {
            return;
        }

        setquestionFormErrors([]);
        allQuestions[index].saved = true;
        setValue('questions', allQuestions);
        setopenQuestionModal(false);
    };

    const isQuestionFormValid = (index: number, question: QuestionForm): boolean => {
        if (!question.title) {
            setquestionFormErrors(['Question is required']);

            return false;
        }

        if (question.type === 'Multiple Choice' && question.choices.length < 2) {
            setquestionFormErrors(['Multiple Choice question must have at least 2 choices']);

            return false;
        }

        if (question.type === 'Multiple Choice' && !question.answer) {
            setquestionFormErrors(['Multiple Choice question must have a correct answer']);

            return false;
        }

        return true;
    }

    const handleAddChoice = () => {
        const allQuestions = getValues('questions');
        const question = allQuestions[allQuestions.length - 1]
        question.choices.push({ id: uuidv4(), text: '' });

        setValue('questions', allQuestions);
    }

    const handleRemoveChoice = (index: number) => {
        const lastQuestion = getLastQuestion();
        const newChoices = lastQuestion?.choices.filter((_, i) => i !== index);

        if (lastQuestion && newChoices) {
            const allQuestions = getValues('questions');
            lastQuestion.choices = newChoices;
            allQuestions[index] = lastQuestion;
            setValue('questions', allQuestions);
        }
    };

    const FormErrors = () => (
        formErrors.map((error, index) => ( <p key={index} className="text-red-500">{error}</p>))
    );

    const getLastQuestion = (): QuestionForm | undefined => {
        if (getValues('questions')?.length) {
            return getValues('questions')[getValues('questions').length - 1];
        }

        return undefined;
    }

    const getLastQuestionIndex = (): number => {
        return getValues('questions')?.length - 1 || 0;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Loading show={isLoading} ariaLabel="Saving Test" />

            <FieldWrapper>
                <Input
                    register={register}
                    label="Title"
                    placeholder="Test Title"
                    name="title"
                    id="title"
                    error={errors.title?.type === "required" && 'Title is required'}
                    required
                />
            </FieldWrapper>

            <FieldWrapper>
                <Textarea
                    register={register}
                    label="Description (optional)"
                    placeholder="Test Description"
                    name="description"
                    id="description"
                />
            </FieldWrapper>

            <FieldWrapper>
                <fieldset className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    <legend>Tags (optional)</legend>
                    <small className='mb-4'><em>Adding tags to your test can help you sort/filter tests.</em></small>
                    <ul>
                        {fields.map((field, index) => (
                            <li key={field.id} className="flex items-center gap-2">
                                <Input
                                    register={register}
                                    label={`Tag ${index + 1}`}
                                    id={`tag-${index}`}
                                    name={`tags.${index}.tag`}
                                    placeholder="Enter a tag"
                                    type="text"
                                />
                                <Button type="button" color="red" onClick={() => remove(index)}>
                                    Remove
                                </Button>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <Button type="button" onClick={() => append({ tag: '' })}>
                    Add Tag
                </Button>
            </FieldWrapper>

            <FieldWrapper>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Questions</label>
                {getValues('questions')?.map((question, index) => (

                    <div key={question.question_id} className="flex items-center gap-2">
                        {
                            question.saved &&
                                <>
                                    <Card href="#" className="max-w-sm">
                                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                            {question.title}
                                        </h5>
                                    </Card>
                                    <Button type="button" color="red" onClick={() => handleRemoveQuestion(index)}>
                                        Remove
                                    </Button>
                                </>
                        }
                    </div>
                ))}
                <Button type="button" onClick={handleAddQuestion}>
                    Add Question
                </Button>
                <Modal show={openQuestionModal} onClose={() => handleRemoveQuestion(getLastQuestionIndex())}>
                    <Modal.Header>New Question</Modal.Header>
                    <Modal.Body>
                        <div className="space-y-4">
                            <FieldWrapper>
                                <Input
                                    register={register}
                                    label='Question'
                                    type='text'
                                    id={`question-${getLastQuestionIndex()}`}
                                    name={`questions.${getLastQuestionIndex()}.title`}
                                    required
                                />
                            </FieldWrapper>
                            <FieldWrapper>
                                <Textarea
                                    register={register}
                                    label="Question Description (optional)"
                                    placeholder="If you need to write any explanation text about the question"
                                    id={`question-${getLastQuestionIndex()}`}
                                    name={`questions.${getLastQuestionIndex()}.description`}
                                />
                            </FieldWrapper>
                            {
                                getLastQuestion()?.type === 'Multiple Choice' && Array.isArray(getLastQuestion()?.answer) &&
                                    (getLastQuestion()?.choices as any).map((a: {id:string, text:string}, index: number) => (
                                        <FieldWrapper key={a.id}>
                                            <Input
                                                register={register}
                                                label={`Answer ${index + 1}`}
                                                id={`answer-${index}`}
                                                placeholder="Enter an answer"
                                                name={`questions.${getValues('questions').length - 1}.answer.${index}`}
                                                type='text'
                                            />
                                        </FieldWrapper>
                                    ))
                            }

                            <FieldWrapper>
                                <RadioGroup
                                    layout="vertical"
                                    legend="Question Type"
                                    required
                                >
                                    <Radio
                                        register={register}
                                        id="multiple-choice-radio"
                                        label="Multiple Choice"
                                        value="Multiple Choice"
                                        name={`questions.${getLastQuestionIndex()}.type`}
                                        className='mb-2'
                                        required={true}
                                    />
                                    <Radio
                                        register={register}
                                        id="true-false-radio"
                                        label="True False"
                                        value="True False"
                                        name={`questions.${getLastQuestionIndex()}.type`}
                                        className='mb-2'
                                        required={true}
                                    />
                                    <Radio
                                        register={register}
                                        id="short-answer-radio"
                                        label="Short Answer"
                                        value="Short Answer"
                                        name={`questions.${getLastQuestionIndex()}.type`}
                                        className='mb-2'
                                        required={true}
                                    />
                                    <Radio
                                        register={register}
                                        id="essay-radio"
                                        label="Essay"
                                        value="Essay"
                                        name={`questions.${getLastQuestionIndex()}.type`}
                                        className='mb-2'
                                        required={true}
                                    />
                                </RadioGroup>
                            </FieldWrapper>

                            {
                                (getLastQuestion()?.choices?.length ?? 0) > 0 && getLastQuestion()?.type === 'Multiple Choice' &&
                                    <p className="font-bold !-mb-3">Choices</p>
                            }

                            {
                                (getLastQuestion()?.choices?.length ?? 0) > 0 && getLastQuestion()?.type === 'Multiple Choice' &&
                                    getLastQuestion()?.choices.map((choice, index) => (
                                        <div className='flex items-center gap-3' key={choice.id}>
                                            <span>{index + 1}</span>
                                            <Input
                                                register={register}
                                                label={`Choice ${index + 1}`}
                                                id={`choice-${index}`}
                                                name={`questions.${getLastQuestionIndex()}.choices.${index}.text`}
                                                placeholder="Enter choice"
                                                type="text"
                                                aria-label={`Choice ${index + 1}`}
                                                hideLabel={true}
                                            />
                                            <Button type="button" size="lg" color="red" onClick={() => handleRemoveChoice(index)}>
                                                Remove
                                            </Button>
                                        </div>
                                    ))
                            }

                            {
                                getLastQuestion()?.type === 'Multiple Choice' &&
                                    <Button type="button" className="mt-3" onClick={handleAddChoice}>
                                        Add Answer Choice
                                    </Button>
                            }

                            {
                                (getLastQuestion()?.type === 'Multiple Choice' || getLastQuestion()?.type === 'True False') &&
                                    <CheckboxGroup
                                        legend={
                                            <div className='flex items-center gap-2'>
                                                <span>Auto Grade Question</span>
                                                <Tooltip content="If checked, Quizzle will grade this question for you.">
                                                    <QuestionCircle height={16} color='#111827' />
                                                </Tooltip>
                                            </div>
                                        }
                                        layout='vertical'
                                        className='mb-2'
                                    >
                                        <Checkbox
                                            register={register}
                                            id={`auto-grade`}
                                            label="Auto Grade"
                                            value="yes"
                                            name={`questions.${getLastQuestionIndex()}.autoGrade`}
                                        />
                                    </CheckboxGroup>
                            }

                        </div>
                    </Modal.Body>
                    <Modal.Footer className='flex-col items-start space-x-0'>
                        {
                            questionFormErrors.map((error, index) => ( <p key={index} className="text-red-500 mb-2">{error}</p>))
                        }
                        <div className="flex gap-2 ml-0">
                            <Button onClick={() => handleSaveQuestion(getLastQuestionIndex(), getValues('questions')[getLastQuestionIndex()])}>
                                Save
                            </Button>
                            <Button color="red" onClick={() => handleRemoveQuestion(getLastQuestionIndex())}>
                                Cancel
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </FieldWrapper>

            <FieldWrapper>
                <FormErrors />
            </FieldWrapper>

            <FieldWrapper>
                <Button type="submit" color="green">Save Test</Button>
            </FieldWrapper>
        </form>
    );
}
