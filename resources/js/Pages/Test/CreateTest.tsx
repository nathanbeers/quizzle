import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import type { Test } from '@/types/test';
import axios from '@/lib/axios';
import CreateTestForm from './Partials/CreateTestForm';
import Button from '@/Components/Button';

export default function CreateTest() {
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Test</h2>}
        >
            <Head title="Create New Test" />

            <div className="py-12">
                <Button color="green">Click me</Button>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <CreateTestForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
