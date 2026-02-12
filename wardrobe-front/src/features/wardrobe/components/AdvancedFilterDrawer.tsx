import { X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

import type React from 'react';

interface AdvancedFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeSeason: string | null;
    onSelectSeason: (season: string | null) => void;
    activeStatus: string | null;
    onSelectStatus: (status: string | null) => void;
    onReset: () => void;
    // New Filters
    activeBrands?: string[];
    onSelectBrand?: (brand: string) => void;
    availableBrands?: string[];
    priceRange?: { min: number; max: number } | null;
    onSetPriceRange?: (range: { min: number; max: number } | null) => void;
}

const SEASONS = ['春', '夏', '秋', '冬'];
const STATUSES = ['在馆', '待洗', '维修', '干洗'];
const PRICE_PRESETS = [
    { label: '¥0-100', min: 0, max: 100 },
    { label: '¥100-300', min: 100, max: 300 },
    { label: '¥300-500', min: 300, max: 500 },
    { label: '¥500+', min: 500, max: 9999999 },
];

const AdvancedFilterDrawer: React.FC<AdvancedFilterDrawerProps> = ({
    isOpen,
    onClose,
    activeSeason,
    onSelectSeason,
    activeStatus,
    onSelectStatus,
    onReset,
    activeBrands = [],
    onSelectBrand,
    availableBrands = [],
    priceRange,
    onSetPriceRange
}) => {
    const [isBrandExpanded, setIsBrandExpanded] = useState(false);

    // We use local state for inputs to avoid jumping, sync with props
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        if (priceRange) {
            setMinPrice(priceRange.min.toString());
            setMaxPrice(priceRange.max > 1000000 ? '' : priceRange.max.toString());
        } else {
            setMinPrice('');
            setMaxPrice('');
        }
    }, [priceRange]);

    const handlePriceInput = (type: 'min' | 'max', value: string) => {
        // Allow empty or numbers
        if (value && !/^\d*$/.test(value)) {return;}

        if (type === 'min') {setMinPrice(value);}
        else {setMaxPrice(value);}

        const newMin = type === 'min' ? (value ? parseInt(value) : 0) : (minPrice ? parseInt(minPrice) : 0);
        const newMax = type === 'max' ? (value ? parseInt(value) : 9999999) : (maxPrice ? parseInt(maxPrice) : 9999999);

        if (onSetPriceRange) {
            if (!value && (type === 'min' ? !maxPrice : !minPrice)) {
                onSetPriceRange(null);
            } else {
                onSetPriceRange({ min: newMin, max: newMax });
            }
        }
    };

    if (!isOpen) { return null; }

    const visibleBrands = isBrandExpanded ? availableBrands : availableBrands.slice(0, 12);

    // Determine active price preset
    const activePreset = PRICE_PRESETS.find(p =>
        priceRange &&
        priceRange.min === p.min &&
        priceRange.max === p.max
    );

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
            <div className="relative bg-white dark:bg-surface-dark rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
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

                    {/* Brand Filter */}
                    {availableBrands.length > 0 && onSelectBrand && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">品牌</h4>
                                <span className="text-xs text-text-secondary/50 font-medium">{availableBrands.length}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {visibleBrands.map((brand) => {
                                    const isActive = activeBrands.includes(brand);
                                    return (
                                        <button
                                            key={brand}
                                            onClick={() => onSelectBrand(brand)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                                                ? 'bg-primary text-text-main shadow-md shadow-primary/10'
                                                : 'bg-gray-50 dark:bg-white/5 text-text-secondary hover:bg-gray-100 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            {brand}
                                        </button>
                                    );
                                })}
                            </div>
                            {availableBrands.length > 12 && (
                                <button
                                    onClick={() => setIsBrandExpanded(!isBrandExpanded)}
                                    className="flex items-center gap-1 text-xs font-bold text-text-secondary hover:text-primary transition-colors px-1"
                                >
                                    {isBrandExpanded ? (
                                        <>收起 <ChevronUp size={14} /></>
                                    ) : (
                                        <>展开全部 <ChevronDown size={14} /></>
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Price Range Filter */}
                    {onSetPriceRange && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider px-1">价格区间</h4>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {PRICE_PRESETS.map((preset) => (
                                    <button
                                        key={preset.label}
                                        onClick={() => {
                                            if (activePreset?.label === preset.label) {
                                                onSetPriceRange(null);
                                            } else {
                                                onSetPriceRange({ min: preset.min, max: preset.max });
                                            }
                                        }}
                                        className={`py-3 rounded-2xl text-sm font-bold transition-all ${activePreset?.label === preset.label
                                            ? 'bg-primary text-text-main shadow-lg shadow-primary/20 scale-[1.02]'
                                            : 'bg-gray-50 dark:bg-white/5 text-text-secondary hover:bg-gray-100 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-3 mt-3">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">¥</span>
                                    <input
                                        type="tel"
                                        placeholder="最低价"
                                        value={minPrice}
                                        onChange={(e) => handlePriceInput('min', e.target.value)}
                                        className="w-full h-10 pl-7 pr-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-white/10 outline-none text-sm font-medium transition-all"
                                    />
                                </div>
                                <span className="text-gray-300">-</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">¥</span>
                                    <input
                                        type="tel"
                                        placeholder="最高价"
                                        value={maxPrice}
                                        onChange={(e) => handlePriceInput('max', e.target.value)}
                                        className="w-full h-10 pl-7 pr-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-white/10 outline-none text-sm font-medium transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

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
