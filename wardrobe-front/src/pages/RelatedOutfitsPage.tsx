import { ChevronLeft, ArrowRight, Calendar, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { outfitService } from '@/features/outfit/services/outfitService';
import { wardrobeService } from '@/features/wardrobe/services/wardrobeService';

import type { Outfit, ClothingItem } from '@/types/index';
import type React from 'react';

const RelatedOutfitsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState<ClothingItem | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) { return; }
      setLoading(true);
      try {
        // Parallel fetch
        const [itemData, outfitsData] = await Promise.all([
          wardrobeService.fetchItem(id),
          outfitService.fetchRelatedOutfits(id)
        ]);
        setItem(itemData);
        setOutfits(outfitsData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, [id]);

  const handleBack = () => {
    void navigate(-1);
  };

  const handleOutfitClick = (outfitId: string) => {
    void navigate('/plan', { state: { highlightId: outfitId } });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!item) { return <div>Item not found</div>; }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center text-primary"
          >
            <ChevronLeft className="w-7 h-7" />
            <span className="text-[17px] font-medium">详情</span>
          </button>
          <h1 className="text-[17px] font-semibold absolute left-1/2 -translate-x-1/2">相关搭配</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="max-w-md mx-auto py-6 px-4 space-y-6">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-lg bg-white dark:bg-white/10 overflow-hidden shadow-sm shrink-0">
              <img src={item.imageUrl || 'https://via.placeholder.com/100x100?text=No+Img'} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium">当前单品</p>
              <h2 className="text-lg font-bold leading-tight text-text-main dark:text-white">{item.name}</h2>
            </div>
          </div>
          <p className="text-text-secondary text-sm">
            已用于 <span className="text-primary font-bold">{outfits.length}</span> 个搭配计划
          </p>
        </div>

        <div className="space-y-6">
          {outfits.map((outfit) => (
            <div
              key={outfit.id}
              role="button"
              tabIndex={0}
              onClick={() => handleOutfitClick(outfit.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOutfitClick(outfit.id);
                }
              }}
              className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform duration-200"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold tracking-tight text-text-main dark:text-white">{outfit.title}</h3>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                </div>

                <div className="flex -space-x-3 mb-5 overflow-hidden py-1">
                  {outfit.items.slice(0, 3).map((imgItem) => (
                    <div key={imgItem.id} className={`relative w-14 h-14 rounded-full border-2 border-white dark:border-surface-dark overflow-hidden bg-gray-100`}>
                      <img src={imgItem.imageUrl || 'https://via.placeholder.com/100x100?text=?'} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {outfit.items.length > 3 && (
                    <div className="relative w-14 h-14 rounded-full border-2 border-white dark:border-surface-dark bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 z-0">
                      +{outfit.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center text-text-secondary text-sm">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>上次穿着: {outfit.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full bg-blue-500`}></span>
                    <span className="text-xs font-medium text-gray-400">{outfit.occasion}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-8 right-6">
        <button
          type="button"
          className="w-14 h-14 bg-text-main dark:bg-primary rounded-full shadow-lg flex items-center justify-center text-white dark:text-text-main hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default RelatedOutfitsPage;