import { Loader2, CirclePlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

import AdvancedFilterDrawer from '@/features/wardrobe/components/AdvancedFilterDrawer';
import WardrobeEmptyState from '@/features/wardrobe/components/WardrobeEmptyState';
import WardrobeFilters from '@/features/wardrobe/components/WardrobeFilters';
import WardrobeHeader from '@/features/wardrobe/components/WardrobeHeader';
import WardrobeItemCard from '@/features/wardrobe/components/WardrobeItemCard';
import { useWardrobe } from '@/features/wardrobe/hooks/useWardrobe';

import { WardrobeItemCardSkeleton } from '@/features/wardrobe/components/WardrobeItemCardSkeleton';

import type React from 'react';

interface LocationState {
  category?: string;
}

const WardrobePage: React.FC = () => {
  const {
    filteredItems,
    loading,
    categories,
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    activeSeason,
    setActiveSeason,
    activeStatus,
    setActiveStatus,
    activeBrands,
    setActiveBrands,
    availableBrands,
    priceRange,
    setPriceRange,
    resetFilters
  } = useWardrobe();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const location = useLocation();
  const state = location.state as LocationState | null;

  // Sync state from location (if navigated with category state)
  useEffect(() => {
    if (state?.category) {
      setActiveCategory(state.category);
      window.history.replaceState({}, document.title);
    }
  }, [state, setActiveCategory]);

  const handleToggleBrand = (brand: string) => {
    if (activeBrands.includes(brand)) {
      setActiveBrands(activeBrands.filter(b => b !== brand));
    } else {
      setActiveBrands([...activeBrands, brand]);
    }
  };

  const formatPriceRange = (range: { min: number; max: number }) => {
    if (range.max > 1000000) {return `¥${range.min}+`;}
    return `¥${range.min}-${range.max}`;
  };

  return (
    <div className="pb-24 bg-background-light dark:bg-background-dark min-h-screen">
      {/* Header Area (Includes Title & Search) */}
      <div className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md pb-2 border-b border-gray-100 dark:border-gray-800">
        <WardrobeHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onOpenFilter={() => setIsFilterOpen(true)}
        />
        <WardrobeFilters
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        {(activeSeason || activeStatus || activeBrands.length > 0 || priceRange) && (
          <div className="px-5 py-1 flex flex-wrap gap-2 animate-in fade-in duration-300">
            {activeSeason && (
              <button
                onClick={() => setActiveSeason(null)}
                className="px-2 py-0.5 bg-primary/20 text-text-main text-[10px] font-bold rounded-md border border-primary/30 uppercase flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-200 transition-colors group"
              >
                季节: {activeSeason}
                <X size={10} className="hidden group-hover:block" />
              </button>
            )}
            {activeStatus && (
              <button
                onClick={() => setActiveStatus(null)}
                className="px-2 py-0.5 bg-primary/20 text-text-main text-[10px] font-bold rounded-md border border-primary/30 uppercase flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-200 transition-colors group"
              >
                状态: {activeStatus}
                <X size={10} className="hidden group-hover:block" />
              </button>
            )}
            {activeBrands.map(brand => (
              <button
                key={brand}
                onClick={() => handleToggleBrand(brand)}
                className="px-2 py-0.5 bg-primary/20 text-text-main text-[10px] font-bold rounded-md border border-primary/30 uppercase flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-200 transition-colors group"
              >
                品牌: {brand}
                <X size={10} className="hidden group-hover:block" />
              </button>
            ))}
            {priceRange && (
              <button
                onClick={() => setPriceRange(null)}
                className="px-2 py-0.5 bg-primary/20 text-text-main text-[10px] font-bold rounded-md border border-primary/30 uppercase flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-200 transition-colors group"
              >
                价格: {formatPriceRange(priceRange)}
                <X size={10} className="hidden group-hover:block" />
              </button>
            )}
          </div>
        )}
      </div>

      <AdvancedFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeSeason={activeSeason}
        onSelectSeason={setActiveSeason}
        activeStatus={activeStatus}
        onSelectStatus={setActiveStatus}
        onReset={resetFilters}
        activeBrands={activeBrands}
        onSelectBrand={handleToggleBrand}
        availableBrands={availableBrands}
        priceRange={priceRange}
        onSetPriceRange={setPriceRange}
      />

      {/* Grid Content */}
      <div className="p-4 min-h-[50vh]">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <WardrobeItemCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <WardrobeItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <WardrobeEmptyState />
            )}
          </>
        )}
      </div>

      {/* Floating Add Button */}
      <Link to="/add" className="fixed bottom-24 right-6 w-14 h-14 bg-primary rounded-full shadow-[0_4px_14px_0_rgba(250,198,56,0.39)] flex items-center justify-center text-text-main z-30 hover:scale-105 active:scale-95 transition-transform">
        <CirclePlus className="w-8 h-8" />
      </Link>
    </div>
  );
};

export default WardrobePage;