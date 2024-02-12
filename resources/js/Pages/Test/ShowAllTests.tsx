import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import type { Test } from '@/types/test';
import axios from '@/lib/axios';
import { Card } from 'flowbite-react';
import { truncateString } from '@/helpers';

export default function ShowAllTests() {
    const [tests, setTests] = useState<Test[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const user = usePage<PageProps>().props.auth.user;

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axios.get('/user/tests');
                setTests(response.data);
            } catch (error) {
                console.error('There was an error fetching the tests:', error);
                setError('Failed to load tests.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTests();
    }, []);

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">All Tests</h2>}
        >
            <Head title="All Tests" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div>Loading tests...</div>
                    ) : error ? (
                        <div className="text-red-600">{error}</div>
                    ) : (
                        <div>
                            {tests.length > 0 ? (
                                <div className='grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                    {tests.map((test) => (
                                        <Link key={test.id} href={route('user.test.show', {id: test.id})}>
                                            <Card className="max-w-sm">
                                                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                    {test.title}
                                                </h5>
                                                { JSON.parse(test.tags)?.length > 0 && (
                                                    <div className='flex gap-2 flex-wrap'>
                                                        {JSON.parse(test.tags).map((tag: string, index: number) => (
                                                            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {test.description && (
                                                    <p className="mt-2 text-gray-700 dark:text-gray-400">
                                                        {truncateString(test.description, 100)}
                                                    </p>
                                                )}
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div>You haven't created any tests yet. <Link href={route('user.test.create')}>Create a test</Link> now.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
