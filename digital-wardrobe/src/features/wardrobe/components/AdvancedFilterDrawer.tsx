import { X, RotateCcw } from 'lucide-react';

import type React from 'react';

interface AdvancedFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeSeason: string | null;
    onSelectSeason: (season: string | null) => void;
    activeStatus: string | null;
    onSelectStatus: (status: string | null) => void;
    onReset: () => void;
}

const SEASONS = ['春', '夏', '秋', '冬'];
const STATUSES = ['在馆', '待洗', '维修', '干洗'];

const AdvancedFilterDrawer: React.FC<AdvancedFilterDrawerProps> = ({
    isOpen,
    onClose,
    activeSeason,
    onSelectSeason,
    activeStatus,
    onSelectStatus,
    onReset
}) => {
    if (!isOpen) { return null; }

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <div
                role="button"
                tabIndex={-1}
                aria-label="Close filters"
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
                onKeyDown={(e) => { if (e.key === 'Escape') { onClose(); } }}
            />

            {/* Drawer Content */}
            <div className="relative bg-white dark:bg-surface-dark rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-text-main dark:text-white">筛选</h3>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                        >
                            <RotateCcw size={14} />
                            重置
                        </button>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-text-main dark:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Season Filter */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider px-1">适用季节</h4>
                        <div className="grid grid-cols-4 gap-3">
                            {SEASONS.map((season) => (
                                <button
                                    key={season}
                                    onClick={() => onSelectSeason(activeSeason === season ? null : season)}
                                    className={`py-3 rounded-2xl text-sm font-bold transition-all ${activeSeason === season
                                        ? 'bg-primary text-text-main shadow-lg shadow-primary/20 scale-[1.02]'
                                        : 'bg-gray-50 dark:bg-white/5 text-text-secondary hover:bg-gray-100 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {season}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider px-1">物品状态</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {STATUSES.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => onSelectStatus(activeStatus === status ? null : status)}
                                    className={`py-4 rounded-2xl text-sm font-bold transition-all ${activeStatus === status
                                        ? 'bg-primary text-text-main shadow-lg shadow-primary/20 scale-[1.02]'
                                        : 'bg-gray-50 dark:bg-white/5 text-text-secondary hover:bg-gray-100 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-4 mt-4 bg-text-main dark:bg-white text-white dark:text-text-main rounded-2xl font-bold shadow-xl active:scale-[0.98] transition-all"
                    >
                        应用筛选
                    </button>
                </div>

                {/* Safe Area Spacer (for mobile notch) */}
                <div className="h-6" />
            </div>
        </div>
    );
};

export default AdvancedFilterDrawer;
