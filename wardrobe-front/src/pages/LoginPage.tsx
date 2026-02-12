import { Mail, Lock, Loader2, AlertCircle, MessageCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import { authService } from '../services/api/authService';

import type React from 'react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const isWechat = authService.isWechatBrowser();

    const handleWechatLogin = useCallback(async (code: string) => {
        setLoading(true);
        setError(null);
        try {
            await authService.signInWithWechat(code);
            void navigate('/', { replace: true }); // Success, go to main page
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : '微信登录失败';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [navigate]);


    // Handle WeChat Callback
    useEffect(() => {
        const params = new URLSearchParams(window.location.search || window.location.hash.split('?')[1]);
        const code = params.get('code');
        const state = params.get('state');

        if (code && state === 'wechat_login') {
            void handleWechatLogin(code);
        }
    }, [handleWechatLogin]);

    const triggerWechatAuth = () => {
        window.location.href = authService.getWechatAuthUrl(false);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) { throw signUpError; }
                setMessage('注册成功！请检查您的邮箱以完成验证。');
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) { throw signInError; }
                void navigate('/', { replace: true }); // Redirect to home after login
            }
        } catch (err: unknown) {
            let errorMessage = err instanceof Error ? err.message : '认证失败';

            // 友好的中文错误提示
            if (errorMessage.includes('User already registered') || errorMessage.includes('already taken')) {
                errorMessage = '该邮箱已被注册，请直接登录';
                // 自动切换到登录模式
                setTimeout(() => setIsSignUp(false), 1500);
            } else if (errorMessage.includes('Invalid login credentials')) {
                errorMessage = '邮箱或密码错误';
            } else if (errorMessage.includes('Password should be at least')) {
                errorMessage = '密码长度至少需要6位';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark">
            <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm">
                        <img src="/logo.png" alt="Digital Wardrobe Logo" className="w-full h-full object-cover" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-6 text-center text-text-main dark:text-text-main-dark">
                    {isSignUp ? '创建账号' : '欢迎回来'}
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {message}
                    </div>
                )}

                <form onSubmit={(e) => { void handleAuth(e); }} className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="login-email" className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark ml-1">邮箱</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="hello@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="login-password" className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark ml-1">密码</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? '注册' : '登录')}
                    </button>
                </form>

                {isWechat && !isSignUp && (
                    <div className="mt-6">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-surface-light dark:bg-surface-dark px-2 text-text-secondary dark:text-text-secondary-dark font-medium">
                                    或
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={triggerWechatAuth}
                            className="w-full bg-[#07C160] hover:bg-[#06AD56] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageCircle size={20} />
                            微信一键登录
                        </button>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-text-secondary dark:text-text-secondary-dark hover:text-primary transition-colors"
                    >
                        {isSignUp ? '已有账号？去登录' : "还没有账号？去注册"}
                    </button>
                </div>

                {!isSignUp && (
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => { void navigate('/forgot-password'); }}
                            className="text-xs text-text-secondary/80 hover:text-primary transition-colors"
                        >
                            忘记密码？
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
