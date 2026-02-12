import { ChevronLeft, Search, Ellipsis, Shirt, ArrowRight, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
// import { MOCK_OUTFITS } from '@/utils/constants'; // REMOVED
import { useNavigate, useLocation } from 'react-router-dom';

import OptimizedImage from '@/components/common/OptimizedImage';
import CalendarView from '@/features/outfit/components/CalendarView';
import { outfitService } from '@/features/outfit/services/outfitService';
import { getCategoryLabel } from '@/utils/formatters';

import type { Outfit } from '@/types/index';
import type React from 'react';

type ViewMode = 'list' | 'calendar';

const OutfitPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { highlightId?: string } | undefined;
  const highlightId = state?.highlightId;
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    const loadOutfits = async () => {
      setLoading(true);
      try {
        const data = await outfitService.fetchOutfits();
        setOutfits(data);
      } catch (error) {
        console.error('Failed to load outfits', error);
      } finally {
        setLoading(false);
      }
    };
    void loadOutfits();
  }, []);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex items-center bg-white dark:bg-surface-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => { void navigate(-1); }}
          className="text-text-main dark:text-white flex size-12 shrink-0 items-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center">
          搭配灵感
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button type="button" className="flex items-center justify-center h-12 bg-transparent text-text-main dark:text-white">
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex px-4 py-4 bg-white dark:bg-surface-dark">
        <div className="flex h-11 flex-1 items-center justify-center rounded-xl bg-background-light dark:bg-background-dark p-1.5 shadow-sm border border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all ${viewMode === 'list'
              ? 'bg-white dark:bg-surface-dark shadow-sm text-text-main dark:text-white'
              : 'text-text-secondary hover:bg-white/50 dark:hover:bg-surface-dark/50'
              }`}
          >
            列表视图
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all ${viewMode === 'calendar'
              ? 'bg-white dark:bg-surface-dark shadow-sm text-text-main dark:text-white'
              : 'text-text-secondary hover:bg-white/50 dark:hover:bg-surface-dark/50'
              }`}
          >
            日历视图
          </button>
        </div>
      </div>

      {/* List Header */}
      {viewMode === 'list' && (
        <div className="flex items-center justify-between px-4 pb-2 pt-6">
          <h3 className="text-text-main dark:text-white text-xl font-bold leading-tight">
            近期计划
          </h3>
          <span className="text-xs font-medium text-text-secondary tracking-wider">LATEST</span>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : viewMode === 'calendar' ? (
        /* Calendar View */
        <div className="px-4">
          <CalendarView outfits={outfits} />
        </div>
      ) : (
        /* List View */
        <div className="flex flex-col gap-3 p-4">
          {outfits.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>暂无搭配计划</p>
              <button
                type="button"
                onClick={() => { void navigate('/add-outfit'); }}
                className="mt-4 text-primary font-bold"
              >
                创建第一个搭配
              </button>
            </div>
          ) : (
            outfits.map((outfit) => {
              const isHighlighted = outfit.id === highlightId;
              return (
                <div
                  key={outfit.id}
                  className={`flex flex-col bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border ${isHighlighted ? 'border-primary ring-1 ring-primary/20 scale-[1.02]' : 'border-gray-100 dark:border-gray-800'} transition-all active:scale-[0.99]`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-text-main dark:text-white text-base font-bold">
                        {outfit.title}
                      </p>
                      <p className="text-text-secondary text-xs font-medium mt-0.5">
                        {outfit.date} • {outfit.time || '全天'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent highlight/toggle logic if added later
                        void navigate(`/outfit/edit/${outfit.id}`);
                      }}
                      className="p-2 -mr-2 text-text-secondary hover:text-primary transition-colors"
                    >
                      <Ellipsis className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Overlapping Icons to simulate item stack */}
                    <div className="flex -space-x-3 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                      {outfit.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-center h-14 w-14 rounded-full bg-gray-100 border-2 border-white dark:border-surface-dark relative overflow-hidden`}
                          style={{ zIndex: 30 - idx }}
                        >
                          {item.imageUrl ? (
                            <OptimizedImage
                              src={item.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Shirt className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      ))}
                      {outfit.items.length > 3 && (
                        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gray-200 border-2 border-white dark:border-surface-dark relative z-0 text-[10px] font-bold text-text-secondary">
                          +{outfit.items.length - 3}
                        </div>
                      )}
                      {outfit.items.length === 0 && (
                        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 border-2 border-white dark:border-surface-dark text-primary relative z-20">
                          <Shirt className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col cursor-pointer group flex-1">
                      <span className="text-sm font-medium text-text-main dark:text-text-main-dark group-hover:text-primary transition-colors flex items-center gap-1">
                        {outfit.items.length > 0
                          ? outfit.items
                            .map((i) => getCategoryLabel(i.subCategory || i.category))
                            .join(', ')
                          : '无单品'}
                        <ArrowRight className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span className="text-xs text-text-secondary">{outfit.occasion}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Outfit List */}
      <div className="flex flex-col gap-3 p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : outfits.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>暂无搭配计划</p>
            <button
              type="button"
              onClick={() => { void navigate('/add-outfit'); }}
              className="mt-4 text-primary font-bold">
              创建第一个搭配
            </button>
          </div>
        ) : (
          outfits.map((outfit) => {
            const isHighlighted = outfit.id === highlightId;
            return (
              <div
                key={outfit.id}
                className={`flex flex-col bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border ${isHighlighted ? 'border-primary ring-1 ring-primary/20 scale-[1.02]' : 'border-gray-100 dark:border-gray-800'} transition-all active:scale-[0.99]`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-text-main dark:text-white text-base font-bold">
                      {outfit.title}
                    </p>
                    <p className="text-text-secondary text-xs font-medium mt-0.5">
                      {outfit.date} • {outfit.time || '全天'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent highlight/toggle logic if added later
                      void navigate(`/outfit/edit/${outfit.id}`);
                    }}
                    className="p-2 -mr-2 text-text-secondary hover:text-primary transition-colors"
                  >
                    <Ellipsis className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Overlapping Icons to simulate item stack */}
                  <div className="flex -space-x-3 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    {outfit.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-center h-14 w-14 rounded-full bg-gray-100 border-2 border-white dark:border-surface-dark relative overflow-hidden`}
                        style={{ zIndex: 30 - idx }}
                      >
                        {item.imageUrl ? (
                          <OptimizedImage src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Shirt className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    ))}
                    {outfit.items.length > 3 && (
                      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gray-200 border-2 border-white dark:border-surface-dark relative z-0 text-[10px] font-bold text-text-secondary">
                        +{outfit.items.length - 3}
                      </div>
                    )}
                    {outfit.items.length === 0 && (
                      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 border-2 border-white dark:border-surface-dark text-primary relative z-20">
                        <Shirt className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col cursor-pointer group flex-1">
                    <span className="text-sm font-medium text-text-main dark:text-text-main-dark group-hover:text-primary transition-colors flex items-center gap-1">
                      {outfit.items.length > 0
                        ? outfit.items
                          .map((i) => getCategoryLabel(i.subCategory || i.category))
                          .join(', ')
                        : '无单品'}
                      <ArrowRight className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <span className="text-xs text-text-secondary">{outfit.occasion}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => { void navigate('/add-outfit'); }}
        className="fixed bottom-24 right-6 flex size-14 items-center justify-center rounded-full bg-primary text-text-main shadow-lg transition-transform active:scale-90 z-20 hover:bg-primary-dark"
      >
        <Plus className="w-8 h-8" />
      </button>

      <div className="h-28"></div>
    </div>
  );
};

export default OutfitPlanPage;
