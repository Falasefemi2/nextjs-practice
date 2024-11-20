"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LoginResponse {
    token: string;
    role: 'admin' | 'user';
}

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [debug, setDebug] = useState({
        token: '',
        cookies: '',
        localStorage: ''
    });

    useEffect(() => {
        const updateDebug = () => {
            setDebug({
                token: localStorage.getItem('token') || 'No token found',
                cookies: document.cookie || 'No cookies found',
                localStorage: JSON.stringify(localStorage, null, 2)
            });
        };

        updateDebug();
        // Update every 2 seconds
        const interval = setInterval(updateDebug, 2000);
        return () => clearInterval(interval);
    }, []);


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
        // <form onSubmit={handleSubmit} className="space-y-4 p-4">
        //     <div className="flex flex-col gap-2">
        //         <input
        //             name="email"
        //             type="email"
        //             placeholder="Email"
        //             required
        //             className="p-2 border rounded"
        //         />
        //         <input
        //             name="password"
        //             type="password"
        //             placeholder="Password"
        //             required
        //             className="p-2 border rounded"
        //         />
        //         <button
        //             type="submit"
        //             disabled={loading}
        //             className="p-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        //         >
        //             {loading ? 'Logging in...' : 'Login'}
        //         </button>
        //     </div>
        //     {error && <p className="text-red-500">{error}</p>}
        // </form>
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

            {/* Debug Information */}
            <div className="mt-8 p-4 bg-gray-100 rounded">
                <h2 className="text-lg font-bold mb-4">Debug Information</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Token:</h3>
                        <pre className="bg-white p-2 rounded overflow-auto">
                            {debug.token}
                        </pre>
                    </div>
                    <div>
                        <h3 className="font-semibold">Cookies:</h3>
                        <pre className="bg-white p-2 rounded overflow-auto">
                            {debug.cookies}
                        </pre>
                    </div>
                    <div>
                        <h3 className="font-semibold">LocalStorage:</h3>
                        <pre className="bg-white p-2 rounded overflow-auto">
                            {debug.localStorage}
                        </pre>
                    </div>
                </div>
            </div>
        </div>

    );
}