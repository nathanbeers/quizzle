import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import type { Test } from '@/types/test';
import Button from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import FieldWrapper from '@/Components/ui/FieldWrapper';
import Loading from '@/Components/ui/Loading';
import axios from '@/lib/axios';
import { useForm, SubmitHandler, set } from 'react-hook-form';

type Inputs = {
    password: string;
};

export default function ShowTest() {
    const [test, setTest] = useState<Test>({} as Test);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [passwordError, setPasswordError] = useState<string>('');
    const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const user = usePage<PageProps>().props.auth.user;
    const testId = usePage<PageProps>().props.testId;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setPasswordError('');
        setIsLoading(true);
        console.log(data);

        try {
            const res = await axios.post(route('test.verify_password'), {password: data.password, test_id: testId});
            console.log(res);
            setShowPasswordForm(false);
        } catch (error: any) {
            console.log(error);

            setPasswordError('Invalid password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchTest = async () => {
            try {
                const response = await axios.get(route('tests.show', { id: testId }));

                if (response.data.hasPassword) {
                    setShowPasswordForm(true);
                }

                setTest(response.data);
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tests</h2>}
        >
            <Head title="Test" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    { isLoading && (
                        <Loading show={isLoading} />
                    )}

                    {showPasswordForm ? (
                        <form className="" onSubmit={handleSubmit(onSubmit)}>
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
                        <div>
                            {test?.id ? (
                                <ul>
                                    <li>{test.title}</li>
                                </ul>
                            ) : (
                                <div>No test found.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
