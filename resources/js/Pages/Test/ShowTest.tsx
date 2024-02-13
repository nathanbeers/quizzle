import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import type { Test, Question, QuestionTypes } from '@/types/test';
import { Button, Input, FieldWrapper, Loading } from '@/Components/ui';
import axios from '@/lib/axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import MultipleChoice from '@/Components/Question/MultipleChoice';
import Textarea from '@/Components/ui/Textarea';
import { json } from 'stream/consumers';

type PasswordInputs = {
    password: string;
};

type QuestionInputs = {
    name: string;
    email: string;
    questions: {
        answerChosen: string;
        correctAnswer: string;
        question_id: string;
    }[];
};

const order: QuestionTypes[] = ['Multiple Choice', 'True False', 'Short Answer', 'Essay'];

const sortQuestions = (questions: Question[]): Question[] => {
  return questions.sort((a, b) => {
    return order.indexOf(a.type) - order.indexOf(b.type);
  });
};

export default function ShowTest() {
    const [test, setTest] = useState<Test>({} as Test);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [passwordError, setPasswordError] = useState<string>('');
    const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [formError, setFormError] = useState<string>();

    const user = usePage<PageProps>().props.auth.user;
    const testId = usePage<PageProps>().props.testId;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordInputs>();

    const {
        register: answerRegister,
        handleSubmit: answerHandleSubmit,
        getValues: getAnswerValues,
        setValue: setAnswerValue,
        formState: { errors: answerErrors },
    } = useForm<QuestionInputs>();

    const onSubmitPW: SubmitHandler<PasswordInputs> = async (data) => {
        setPasswordError('');
        setIsLoading(true);
        console.log(data);

        try {
            const res = await axios.post(route('test.verify_password'), {password: data.password, test_id: testId});
            setShowPasswordForm(false);
        } catch (error: any) {
            console.log(error);

            setPasswordError('Invalid password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmitTest: SubmitHandler<QuestionInputs> = async (data) => {
        setIsLoading(true);
        setFormError('');

        data.questions.forEach((question, index) => {
            const questionData = questions[index];
            question.question_id = questionData.question_id;
            question.correctAnswer = questionData.answer;
        });

        const formData = {
            ...data,
            test_id: testId,
            questions: JSON.stringify(data.questions),
        }

        try {
            const res = await axios.post(route('test.answers.store', {id: testId}), formData);
            console.log(res);
        } catch (error: any) {
            setFormError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchTest = async () => {
            try {
                const response = await axios.get(route('tests.show', { id: testId }));
                const { data } = response;
                const { questions, hasPassword, } = data;

                if (hasPassword) {
                    setShowPasswordForm(true);
                }

                setTest(response.data);
                setQuestions(sortQuestions(JSON.parse(questions)));
            } catch (error) {
                console.error('There was an error fetching the test:', error);
                setError('Failed to load test.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTest();
    }, []);

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{test?.title}</h2>}
        >
            <Head title="Test" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    { isLoading && (
                        <Loading show={isLoading} />
                    )}

                    {showPasswordForm ? (
                        <form className="" onSubmit={handleSubmit(onSubmitPW)}>
                            <p className='mb-4 text-xl'>This test is password protected.</p>
                            <FieldWrapper>
                                <Input
                                    type="password"
                                    label="Enter Password"
                                    name='password'
                                    id='password'
                                    error={passwordError}
                                    register={register}
                                    required
                                />
                            </FieldWrapper>
                            <FieldWrapper>
                                <Button type="submit" color="green" className='mt-6'>Submit</Button>
                            </FieldWrapper>
                        </form>
                    ) : (
                        <form className="mb-6" onSubmit={answerHandleSubmit(onSubmitTest)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FieldWrapper>
                                    <Input
                                        label="Name"
                                        id="name"
                                        name="name"
                                        register={answerRegister}
                                        error={answerErrors.name?.message}
                                        required
                                    />
                                </FieldWrapper>
                                <FieldWrapper>
                                    <Input
                                        label="Email"
                                        id="email"
                                        name="email"
                                        register={answerRegister}
                                        error={answerErrors.email?.message}
                                        required
                                    />
                                </FieldWrapper>
                            </div>
                            {questions.map((question: any, index: number) => (
                                <div key={index}>
                                    {question.type === 'Multiple Choice'  || question.type === 'True False' ? (
                                        <MultipleChoice
                                            choices={question.type === 'Multiple Choice' ? question.choices : question.trueFalseChoices}
                                            question={question.title}
                                            questionIndex={index}
                                            register={answerRegister}
                                            error={answerErrors.questions?.[index]?.answerChosen?.message}
                                        />
                                    ) : question.type === 'Short Answer' ? (
                                        <FieldWrapper>
                                            <Input
                                                label={`${index + 1}. ${question.title}`}
                                                id={`questions.${index}.answerChosen`}
                                                name={`questions.${index}.answerChosen`}
                                                register={answerRegister}
                                                error={answerErrors.questions?.[index]?.answerChosen?.message}
                                                required
                                            />
                                        </FieldWrapper>
                                    ) : (
                                        <FieldWrapper>
                                            <Textarea
                                                label={`${index + 1}. ${question.title}`}
                                                id={`questions.${index}.answerChosen`}
                                                name={`questions.${index}.answerChosen`}
                                                register={answerRegister}
                                                error={answerErrors.questions?.[index]?.answerChosen?.message}
                                                required
                                            />
                                        </FieldWrapper>
                                    )}
                                </div>
                            ))}

                            {formError && (
                                <p className="text-red-500 text-sm my-3">{formError}</p>
                            )}

                            <FieldWrapper>
                                <Button type="submit" color="green">Submit Answers</Button>
                            </FieldWrapper>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
