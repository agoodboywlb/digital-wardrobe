import { ChevronLeft, Loader2, Ruler } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

import type React from 'react';

const EditBodyStatsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        chest: '',
        waist: '',
        hips: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                height: (profile.height as number)?.toString() || '',
                weight: (profile.weight as number)?.toString() || '',
                chest: (profile.chest as number)?.toString() || '',
                waist: (profile.waist as number)?.toString() || '',
                hips: (profile.hips as number)?.toString() || '',
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                height: formData.height ? parseFloat(formData.height) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                chest: formData.chest ? parseFloat(formData.chest) : null,
                waist: formData.waist ? parseFloat(formData.waist) : null,
                hips: formData.hips ? parseFloat(formData.hips) : null,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) { throw error; }

            await refreshProfile();
            setMessage('身材数据已更新');
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
                <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center">身材数据</h2>
                <button
                    type="button"
                    onClick={(e) => { void handleSubmit(e); }}
                    disabled={loading}
                    className="flex w-12 items-center justify-end text-primary font-medium disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : '保存'}
                </button>
            </div>

            <div className="p-4 space-y-8">
                {message && (
                    <div className={`p-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${message.includes('错误') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                        {message}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        体型管理
                    </h3>
                    <p className="text-sm text-text-secondary">准确的数据有助于我们为您提供更精准的穿搭建议</p>
                </div>

                <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-2 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <label htmlFor="profile-height" className="block text-xs font-bold text-text-secondary uppercase">身高 (cm)</label>
                            <input
                                id="profile-height"
                                type="number"
                                name="height"
                                step="0.1"
                                value={formData.height}
                                onChange={handleChange}
                                className="w-full text-2xl font-bold bg-transparent outline-none text-text-main dark:text-white placeholder:text-gray-200"
                                placeholder="0.0"
                            />
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-2 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <label htmlFor="profile-weight" className="block text-xs font-bold text-text-secondary uppercase">体重 (kg)</label>
                            <input
                                id="profile-weight"
                                type="number"
                                name="weight"
                                step="0.1"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full text-2xl font-bold bg-transparent outline-none text-text-main dark:text-white placeholder:text-gray-200"
                                placeholder="0.0"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                        <h4 className="text-sm font-bold text-text-main dark:text-white flex items-center gap-2">
                            <Ruler size={16} className="text-primary" />
                            三围数据
                        </h4>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between group">
                                <label htmlFor="profile-chest" className="text-sm font-medium text-text-secondary">胸围 (cm)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="profile-chest"
                                        type="number"
                                        name="chest"
                                        step="0.1"
                                        value={formData.chest}
                                        onChange={handleChange}
                                        className="w-20 text-right font-bold bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="0.0"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between group">
                                <label htmlFor="profile-waist" className="text-sm font-medium text-text-secondary">腰围 (cm)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="profile-waist"
                                        type="number"
                                        name="waist"
                                        step="0.1"
                                        value={formData.waist}
                                        onChange={handleChange}
                                        className="w-20 text-right font-bold bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="0.0"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between group">
                                <label htmlFor="profile-hips" className="text-sm font-medium text-text-secondary">臀围 (cm)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="profile-hips"
                                        type="number"
                                        name="hips"
                                        step="0.1"
                                        value={formData.hips}
                                        onChange={handleChange}
                                        className="w-20 text-right font-bold bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="0.0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBodyStatsPage;

