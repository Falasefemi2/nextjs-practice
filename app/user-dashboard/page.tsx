'use client';

import { useUser } from '@/lib/useUser';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
    const { data: user, isLoading, error } = useUser();
    const router = useRouter();

    if (isLoading) return <p>Loading...</p>;
    if (error || user?.role !== 'user') {
        router.push('/login');
        return null;
    }

    return <div>Welcome, {user.name}!</div>;
}
