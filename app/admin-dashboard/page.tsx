'use client';

import { useUser } from '@/lib/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function AdminDashboard() {
    const { data: user, isLoading, error } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (error || (user && user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, error, router]);

    if (isLoading) return <p>Loading...</p>;
    if (!user) return null;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-lg">Welcome, Admin {user.name}!</p>
            </div>
        </div>
    );
}