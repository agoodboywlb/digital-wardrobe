import type React from 'react';

interface WardrobeFiltersProps {
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
}

const WardrobeFilters: React.FC<WardrobeFiltersProps> = ({ categories, activeCategory, onSelectCategory }) => {
    return (
        <div className="flex gap-2 overflow-x-auto px-5 py-2 no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === cat
                            ? 'bg-text-main text-white dark:bg-white dark:text-text-main shadow-md'
                            : 'bg-white border border-gray-100 text-gray-500 dark:bg-white/5 dark:border-gray-800 dark:text-gray-400'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default WardrobeFilters;
