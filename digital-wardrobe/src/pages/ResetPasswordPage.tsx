import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';

import type React from 'react';


const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const navigate = useNavigate();

    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            // 1. Try standard check
            let { data } = await supabase.auth.getSession();

            // 2. If no session, try to parse double hash (common with HashRouter)
            if (!data.session && window.location.hash.includes('#access_token=')) {
                // console.log('Detected double hash, attempting manual session set');
                const fragment = window.location.hash.split('#').find(part => part.startsWith('access_token='));
                if (fragment) {
                    const params = new URLSearchParams(fragment);
                    const access_token = params.get('access_token');
                    const refresh_token = params.get('refresh_token');

                    if (access_token && refresh_token) {
                        const { data: setSessionData, error: setSessionError } = await supabase.auth.setSession({
                            access_token,
                            refresh_token
                        });

                        if (!setSessionError) {
                            data = setSessionData;
                        }
                    }
                }
            }

            if (data.session) {
                setHasSession(true);
                setMessage(null);
            } else {
                // If no session, try to wait a bit as Supabase client might be parsing hash
                // Especially important for HashRouter where double hash might occur
                setTimeout(() => {
                    void (async () => {
                        const { data: retryData } = await supabase.auth.getSession();
                        if (retryData.session) {
                            setHasSession(true);
                            setMessage(null);
                        } else {
                            setMessage({ type: 'error', text: 'Auth session missing! Please ensure you clicked the link from your email.' });
                        }
                    })();
                }, 1000);
            }
        };

        void checkSession();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // First ensure we have a session
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session) {
                throw new Error('No active session found. Please try clicking the reset link again.');
            }

            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) { throw error; }

            setMessage({ type: 'success', text: '密码重置完毕，请使用新密码登录' });
            setTimeout(() => {
                void navigate('/login');
            }, 2000);
        } catch (err: unknown) {
            const error = err as Error;
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark">
            <div className="w-full max-w-md bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                <h1 className="text-2xl font-bold mb-6 text-center text-text-main dark:text-main-dark">
                    设置新密码
                </h1>

                {message && (
                    <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {message.text}
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        void handleUpdatePassword(e);
                    }}
                    className="space-y-4"
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
                                disabled={!hasSession || loading}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                                placeholder="请输入新密码"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!hasSession || loading}
                        className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : '重置并登录'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
