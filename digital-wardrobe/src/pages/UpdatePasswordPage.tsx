import { ChevronLeft, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';

import type React from 'react';


const UpdatePasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) { throw error; }

            setMessage({ type: 'success', text: '密码修改成功！' });
            setTimeout(() => {
                void navigate(-1);
            }, 1000);
        } catch (error: unknown) {
            const err = error as Error;
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <div className="flex items-center bg-white dark:bg-surface-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => {
                        void navigate(-1);
                    }}
                    className="text-text-main dark:text-white flex size-12 shrink-0 items-center justify-start"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center">修改密码</h2>
                <div className="w-12" />
            </div>

            <div className="p-4 mt-2 max-w-md mx-auto w-full">
                {message && (
                    <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {message.text}
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        void handleUpdatePassword(e);
                    }}
                    className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4"
                >
                    <div className="space-y-1">
                        <label htmlFor="new-password" title="new-password" className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark ml-1">新密码</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                id="new-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="输入新密码"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : '确认修改'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePasswordPage;
