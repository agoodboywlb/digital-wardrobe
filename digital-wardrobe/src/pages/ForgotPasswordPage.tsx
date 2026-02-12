import { Mail, Loader2, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';

import type React from 'react';


const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const navigate = useNavigate();

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/#/reset-password`,
            });
            if (error) { throw error; }
            setMessage({ type: 'success', text: '重置密码邮件已发送，请检查您的邮箱' });
        } catch (err: unknown) {
            const error = err as Error;
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <div className="flex items-center bg-white dark:bg-surface-dark p-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => { void navigate(-1); }} className="text-text-main dark:text-white p-2">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-text-main dark:text-white text-lg font-bold flex-1 text-center pr-10">找回密码</h2>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-6 text-center">
                        请输入您的注册邮箱，我们将向您发送重置密码的邮件。
                    </p>

                    {message && (
                        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            {message.text}
                        </div>
                    )}

                    <form
                        onSubmit={(e) => {
                            void handleResetRequest(e);
                        }}
                        className="space-y-4"
                    >
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark ml-1">邮箱地址</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="hello@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : '发送重置邮件'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
