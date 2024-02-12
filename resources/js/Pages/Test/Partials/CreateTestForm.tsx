import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, useFieldArray, Controller, set } from "react-hook-form"
import Button from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import FieldWrapper from '@/Components/ui/FieldWrapper';
import Loading from '@/Components/ui/Loading';
import axios from 'axios';
import Textarea from '@/Components/ui/Textarea';
import { Modal, Datepicker, Tooltip, Toast } from 'flowbite-react';
import type { QuestionForm } from '@/types/test';
import { extractStringValues } from '@/helpers';
import { v4 as uuidv4 } from 'uuid';
import { RadioGroup, Radio } from '@/Components/ui/RadioGroup';
import { CheckboxGroup, Checkbox} from '@/Components/ui/CheckboxGroup';
import QuestionCircle from '@/Components/ui/icons/QuestionCircle';
import Select from '@/Components/ui/Select';
import Trashcan from '@/Components/ui/icons/Trashcan';
import clsx from 'clsx';

type Inputs = {
  title: string;
  description: string;
  tags: { tag: string }[];
  questions: QuestionForm[];
  close_date: Date;
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
        const subscription = watch((value, { name, type }) => {
            console.log(value, name, type)
            if (typeof type === 'string' && type.includes('.answer')) {

                //reset answer for last question
                const questions = getValues('questions');

                if (questions?.length > 0) {
                    const updatedQuestions = [...questions];
                    updatedQuestions[updatedQuestions.length -1].answer = '';
                    setValue('questions', updatedQuestions, { shouldValidate: true });
                }
            }

        })
        return () => subscription.unsubscribe()
    }, [watchQuestionField])

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setIsLoading(true);
        const tags = data.tags
                            .filter(tag => !!tag.tag)
                            .reduce<string[]>((acc, tag) => {
                                if (tag.tag) {
                                    acc.push(tag.tag);
                                }
                                return acc;
                            }, []);
        const formData = {
            ...data,
            user_id: userID,
            tags: JSON.stringify(tags),
            questions: JSON.stringify(data.questions),
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
        const newQuestionObj: QuestionForm = {
            question_id: `${userID}${uuidv4()}`,
            title: '',
            type: 'Multiple Choice',
            choices: [],
            trueFalseChoices: [{ id: uuidv4(), text: 'True' }, { id: uuidv4(), text: 'False' }],
            answer: '',
            description: '',
            autoGrade: 'yes',
            saved: false,
        };

        if (getValues('questions')) {
            setValue('questions', [...getValues('questions'), newQuestionObj]);
        }
        else {
            setValue('questions', [newQuestionObj]);
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

        if (
            (question.type === 'True False' || question.type === 'Multiple Choice')
            && question.autoGrade
            && !question.answer
        ) {
            setquestionFormErrors(['Must provide an answer when auto grading is enabled']);

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
                    placeholder="Write a short description about your test"
                    name="description"
                    id="description"
                />
            </FieldWrapper>

            <FieldWrapper>
                <label
                    htmlFor="test-date"
                    className='block text-sm font text-gray-900 dark:text-white font-bold'
                >
                    Test End Date<span className="text-red-500">*</span>
                </label>
                <Controller
                    name="close_date"
                    control={control}
                    render={({ field }) => (
                        <Datepicker
                            id="test-date"
                            name="test_date"
                            onSelectedDateChanged={(date) => {
                                field.onChange(date)
                            }}
                            minDate={new Date()}
                            required
                        />
                    )}
                />
            </FieldWrapper>

            <FieldWrapper>
                <fieldset className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    <legend>Tags (optional)</legend>
                    <p className='mb-0'><small><em>Adding tags to your test can help you sort/filter tests later.</em></small></p>
                    <ul className={clsx(
                        'flex gap-4 flex-wrap',
                        fields.length > 0 && 'my-3'
                    )}>
                        {fields.map((field, index) => (
                            <li key={field.id} className="flex items-center gap-2">
                                <Input
                                    register={register}
                                    label={`${index + 1}.`}
                                    labelPosition='left'
                                    id={`tag-${index}`}
                                    name={`tags.${index}.tag`}
                                    placeholder="Enter a tag"
                                    type="text"
                                />
                                <Button
                                    type="button"
                                    color="red"
                                    size='lg'
                                    onClick={() => remove(index)}
                                    aria-label='Remove Tag'
                                >
                                    <Trashcan height={16} color='white' />
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
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Questions<span className="text-red-500">*</span>
                </label>
                {getValues('questions')?.map((question, index) => (

                    <div key={question.question_id} className="flex items-center gap-2">
                        {
                            question.saved &&
                                <>
                                    <button className="max-w-sm">
                                        <h5 className="font-bold tracking-tight text-gray-900 dark:text-white">
                                            {question.title}
                                        </h5>
                                    </button>
                                    <Button
                                        type="button"
                                        color="red"
                                        onClick={() => handleRemoveQuestion(index)}
                                        aria-label='Remove Question'
                                    >
                                        <Trashcan height={16} color='white' />
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

                            <div className="flex gap-16 flex-wrap">
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
                                    (getLastQuestion()?.type === 'Multiple Choice' || getLastQuestion()?.type === 'True False') &&
                                        <FieldWrapper>
                                            <CheckboxGroup
                                                legend={
                                                    <div className='flex items-center gap-2'>
                                                        <span>Auto Grade Question</span>
                                                        <Tooltip content="If checked, Quizzle will automatically grade this question for you.">
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
                                        </FieldWrapper>
                                }
                            </div>

                            {
                                (getLastQuestion()?.choices?.length ?? 0) > 0 && getLastQuestion()?.type === 'Multiple Choice' &&
                                    <label className="font-bold !-mb-3">Choices (minimum 2)</label>
                            }

                            {
                                (getLastQuestion()?.choices?.length ?? 0) > 0 && getLastQuestion()?.type === 'Multiple Choice' &&
                                    getLastQuestion()?.choices.map((choice, index) => (
                                        <div className='flex items-center gap-3' key={choice.id}>
                                            <Input
                                                register={register}
                                                label={`${index + 1}.`}
                                                id={`choice-${index}`}
                                                name={`questions.${getLastQuestionIndex()}.choices.${index}.text`}
                                                placeholder="Enter choice"
                                                type="text"
                                                aria-label={`Choice ${index + 1}`}
                                                labelPosition={'left'}
                                                wrapperClass="flex-grow"
                                            />
                                            <Button
                                                type="button"
                                                size="lg"
                                                color="red"
                                                onClick={() => handleRemoveChoice(index)}
                                                aria-label='Remove Choice'
                                            >
                                                <Trashcan height={16} color='white' />
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
                                getLastQuestion()?.type === 'Multiple Choice' && (getLastQuestion()?.choices?.length ?? 0) > 0 &&
                                    <FieldWrapper>
                                        <Select
                                            register={register}
                                            label="Correct Answer"
                                            name={`questions.${getLastQuestionIndex()}.answer`}
                                            options={
                                                getLastQuestion()?.choices?.map((choice) => ({ label: choice.text, value: choice.text })) ?? []
                                            }
                                            required
                                        />
                                    </FieldWrapper>
                            }

                            {
                                getLastQuestion()?.type === 'True False' && getLastQuestion()?.trueFalseChoices.length &&
                                    <FieldWrapper>
                                        <Select
                                            register={register}
                                            label="Correct Answer"
                                            name={`questions.${getLastQuestionIndex()}.answer`}
                                            options={
                                                getLastQuestion()?.trueFalseChoices?.map((choice) => ({ label: choice.text, value: choice.text })) ?? []
                                            }
                                            required
                                        />
                                    </FieldWrapper>
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
                <Button type="submit" color="green" className='mt-6'>Save Test</Button>
            </FieldWrapper>
        </form>
    );
}
