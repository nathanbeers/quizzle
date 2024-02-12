import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import type { Test } from '@/types/test';
import axios from '@/lib/axios';
import { set } from 'react-hook-form';

export default function ShowTest() {
    const [test, setTest] = useState<Test>({} as Test);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const user = usePage<PageProps>().props.auth.user;
    const testId = usePage<PageProps>().props.testId;

    useEffect(() => {
        setIsLoading(true);
        const fetchTests = async () => {
            try {
                const response = await axios.get(route('tests.show', { id: testId }));
                setTest(response.data);
            } catch (error) {
                console.error('There was an error fetching the test:', error);
                setError('Failed to load test.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTests();
    }, []);

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tests</h2>}
        >
            <Head title="Test" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div>Loading tests...</div>
                    ) : error ? (
                        <div className="text-red-600">{error}</div>
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
