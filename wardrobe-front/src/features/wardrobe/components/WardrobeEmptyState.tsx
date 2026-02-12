import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type React from 'react';

const WardrobeEmptyState: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="col-span-2 py-8 flex flex-col items-center justify-center px-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-text-main dark:text-white font-medium mb-1">暂无相关单品</p>
            <p className="text-xs text-text-secondary mb-8">换个搜索词试试？</p>

            {/* AI Recommendation Card */}
            <div
                role="button"
                tabIndex={0}
                className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-lg border border-primary/20 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => { void navigate('/plan'); }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        void navigate('/plan');
                    }
                }}
            >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex items-center gap-2 mb-3 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-text-main" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">AI 灵感推荐</span>
                </div>

                <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 relative z-10">周末休闲出行穿搭</h3>
                <p className="text-xs text-text-secondary mb-4 leading-relaxed relative z-10">
                    既然没找到想要的，不如试试这套？根据今日天气，AI 为你生成了适合出行的舒适搭配。
                </p>

                <div className="flex items-center justify-between mt-2 relative z-10">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((_, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-white dark:border-surface-dark bg-gray-100 overflow-hidden">
                                <div className="w-full h-full bg-gray-200" />
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-surface-dark bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                            +2
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            void navigate('/plan');
                        }}
                        className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
                    >
                        查看搭配
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WardrobeEmptyState;
