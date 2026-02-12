import { ChevronLeft, Loader2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

import type React from 'react';

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        bio: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                username: profile.username || '',
                bio: profile.bio || '',
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
        if (e && 'preventDefault' in e) {
            e.preventDefault();
        }

        if (!user) { return; }

        setLoading(true);
        setMessage(null);

        try {
            const updates = {
                id: user.id,
                full_name: formData.full_name,
                username: formData.username,
                bio: formData.bio,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) { throw error; }

            await refreshProfile();
            setMessage('个人资料已更新');
            setTimeout(() => { void navigate(-1); }, 1000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setMessage(`错误: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        void navigate(-1);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <div className="flex items-center bg-white dark:bg-surface-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
                <button
                    type="button"
                    onClick={handleBack}
                    className="text-text-main dark:text-white flex size-12 shrink-0 items-center justify-start"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center">基本资料</h2>
                <button
                    type="button"
                    onClick={(e) => { void handleSubmit(e); }}
                    disabled={loading}
                    className="flex w-12 items-center justify-end text-primary font-medium disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : '保存'}
                </button>
            </div>

            <div className="p-4 space-y-6">
                {message && (
                    <div className={`p-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${message.includes('错误') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                        {message}
                    </div>
                )}

                {/* Avatar Section (Placeholder for now) */}
                <div className="flex flex-col items-center py-4">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-4 border-white dark:border-surface-dark shadow-lg transition-transform group-active:scale-95">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-primary" />
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 border-2 border-white dark:border-surface-dark shadow-sm">
                            <span className="block text-[10px] text-black font-bold">更换</span>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-text-secondary">点击更换头像</p>
                </div>

                {/* Basic Info Form */}
                <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
                        <div className="space-y-1.5">
                            <label htmlFor="profile-full-name" className="block text-xs font-bold text-text-secondary uppercase px-1">昵称</label>
                            <input
                                id="profile-full-name"
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                placeholder="请输入昵称"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="profile-username" className="block text-xs font-bold text-text-secondary uppercase px-1">个人简介</label>
                            <textarea
                                id="profile-bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                                placeholder="介绍一下你自己..."
                            />
                        </div>

                        <div className="space-y-1.5 opacity-60">
                            <label htmlFor="profile-username" className="block text-xs font-bold text-text-secondary uppercase px-1">系统 ID (UID)</label>
                            <input
                                id="profile-username"
                                type="text"
                                name="username"
                                value={formData.username}
                                readOnly
                                className="w-full p-3 bg-gray-100 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800 text-text-secondary cursor-not-allowed text-sm font-mono"
                                placeholder="系统自动生成"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
