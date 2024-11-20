"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginResponse {
    token: string;
    role: 'admin' | 'user';
}

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data: LoginResponse = await response.json();
                // Store token in both localStorage and cookie
                localStorage.setItem('token', data.token);
                document.cookie = `token=${data.token}; path=/`;

                // Wait a bit for the cookie to be set
                await new Promise(resolve => setTimeout(resolve, 100));

                // Redirect based on role
                if (data.role === 'admin') {
                    router.push('/admin-dashboard');
                } else {
                    router.push('/user-dashboard');
                }
                router.refresh(); // Force a refresh of the navigation
            } else {
                setError('Login failed. Please check your credentials.');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div className="flex flex-col gap-2">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        className="p-2 border rounded"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        className="p-2 border rounded"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="p-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
            </form>

        </div>

    );
}