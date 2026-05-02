import React from 'react';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-100 dark:bg-slate-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">
                        Welcome to <span className="text-[var(--color-primary)]">FiNet</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">The Future of Financial Management.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                            <input type="email" id="email" defaultValue="demo@netlabs.ai" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                            <input type="password" id="password" defaultValue="demopassword" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200" />
                        </div>
                        <button type="submit" className="w-full bg-[var(--color-primary)] text-white font-bold py-2 px-4 rounded-md hover:bg-[var(--color-primary-hover)] transition duration-300">Login</button>
                        <div className="text-center mt-4">
                            <a href="#" className="text-sm text-[var(--color-primary)] hover:underline">Forgot Password?</a>
                        </div>
                    </form>
                </div>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                    Don't have an account? <a href="#" className="font-semibold text-[var(--color-primary)] hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;