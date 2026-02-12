import { ScanLine, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

import type React from 'react';

interface WardrobeHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onOpenFilter: () => void;
}

const WardrobeHeader: React.FC<WardrobeHeaderProps> = ({ searchTerm, onSearchChange, onOpenFilter }) => {
    return (
        <>
            <div className="flex items-center justify-between px-5 pt-6 pb-2">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-text-main dark:text-white">我的衣橱</h1>
                <div className="flex items-center gap-3">
                    <Link to="/import" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        <ScanLine className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            <div className="px-5 py-2 flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="搜索单品、标签..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-100 dark:bg-white/5 border-none text-text-main dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary outline-none text-sm font-medium transition-all"
                    />
                </div>
                <button
                    onClick={onOpenFilter}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-text-main dark:hover:text-white transition-colors"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                </button>
            </div>
        </>
    );
};

export default WardrobeHeader;
