import { useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import Button from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import FieldWrapper from '@/Components/ui/FieldWrapper';
import Loading from '@/Components/ui/Loading';
import axios from 'axios';
import Textarea from '@/Components/ui/Textarea';
import { Modal, Card } from 'flowbite-react';
import type { QuestionForm } from '@/types/test';
import { extractStringValues } from '@/helpers';
import { v4 as uuidv4 } from 'uuid';
import RadioGroup from '@/Components/ui/RadioGroup';

type Inputs = {
  title: string;
  description: string;
  tags: { tag: string }[];
  questions: QuestionForm[];
}

export default function CreateTestForm({ userID }: { userID: number }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<string[]>([])
    const [openQuestionModal, setopenQuestionModal] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        control,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<Inputs>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tags",
    });

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
                type: 'multipleChoice',
                answer: [],
                description: '',
                autoGrade: true,
            }]);
        }
        else {
            setValue('questions', [{
                question_id: `${userID}${uuidv4()}`,
                title: '',
                type: 'multipleChoice',
                answer: [],
                description: '',
                autoGrade: true,
            }]);
        }
        setopenQuestionModal(true);
    };

    const handleRemoveQuestion = (index: number) => {
        const newQuestions = getValues('questions').filter((_, i) => i !== index);
        setValue('questions', newQuestions);
        setopenQuestionModal(false);
    };

    const handleSaveQuestion = (index: number, question: QuestionForm) => {
        const newQuestions = [...getValues('questions'), question];
        setValue('questions', newQuestions);
    };

    const handleAddAnswer = () => {
        const allQuestions = getValues('questions');
        const question = allQuestions[allQuestions.length - 1]
        console.log(allQuestions, question);

        if (Array.isArray(question.answer)) {
            question.answer.push('');
        }

        setValue('questions', allQuestions);
    }

    const FormErrors = () => (
        formErrors.map((error, index) => ( <p key={index} className="text-red-500">{error}</p>))
    );

    const getLastQuestion = (): QuestionForm | undefined => {
        if (getValues('questions')?.length) {
            return getValues('questions')[getValues('questions').length - 1];
        }

        return undefined;
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
                    label="Description"
                    placeholder="Test Description"
                    name="description"
                    id="description"
                />
            </FieldWrapper>

            <FieldWrapper>
                <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                <small className='mb-4'>Adding tags to your test will help you sort tests.</small>
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
                <Button type="button" onClick={() => append({ tag: '' })}>
                    Add Tag
                </Button>
            </FieldWrapper>

            <FieldWrapper>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Questions</label>
                {getValues('questions')?.map((question, index) => (
                    <div key={question.question_id} className="flex items-center gap-2">
                        <Card href="#" className="max-w-sm">
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {question.title}
                            </h5>
                        </Card>
                        <Button type="button" color="red" onClick={() => handleRemoveQuestion(index)}>
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" onClick={handleAddQuestion}>
                    Add Question
                </Button>
                <Modal show={openQuestionModal} onClose={() => handleRemoveQuestion(getValues('questions').length - 1)}>
                    <Modal.Header>Add Question</Modal.Header>
                    <Modal.Body>
                        <form className="space-y-6">
                            <FieldWrapper>
                                <Input
                                    register={register}
                                    label='Question Title'
                                    type='text'
                                    id={`question-${getValues('questions')?.length - 1}`}
                                    name={`questions.${getValues('questions')?.length - 1}.title`}
                                />
                            </FieldWrapper>
                            <FieldWrapper>
                                <Textarea
                                    register={register}
                                    label="Question Description (optional)"
                                    placeholder="If you need to write any explanation text about the question"
                                    id={`question-${getValues('questions')?.length - 1}`}
                                    name={`questions.${getValues('questions')?.length - 1}.description`}
                                />
                            </FieldWrapper>
                            {
                                getLastQuestion()?.type === 'multipleChoice' && Array.isArray(getLastQuestion()?.answer) &&
                                    (getLastQuestion()?.answer as any).map((a: string[], index: number) => (
                                        <FieldWrapper key={a[index]}>
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
                                    layout='vertical'
                                    groupName={`questions.${getValues('questions')?.length - 1}.type`}
                                    choices={[
                                        { id: '1', name: 'multipleChoice'},
                                        { id: '2', name: 'trueFalse'},
                                        { id: '3', name: 'shortAnswer'},
                                        { id: '4', name: 'essay'},
                                    ]}
                                />
                            </FieldWrapper>

                            {
                                getLastQuestion()?.type === 'multipleChoice' &&
                                    <Button type="button" onClick={handleAddAnswer}>
                                        Add Answer
                                    </Button>
                            }

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => handleSaveQuestion(getValues('questions').length - 1, getValues('questions')[getValues('questions').length - 1])}>
                            Save
                        </Button>
                        <Button color="red" onClick={() => handleRemoveQuestion(getValues('questions').length - 1)}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </FieldWrapper>

            <FieldWrapper>
                <FormErrors />
            </FieldWrapper>

            <FieldWrapper>
                <Button type="submit" color="green">Save</Button>
            </FieldWrapper>
        </form>
    );
}
