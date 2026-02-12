import { ChevronLeft, Plus, Loader2, Ellipsis, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import OutfitPreview from '@/features/outfit/components/OutfitPreview';
import ImagePreview from '@/components/common/ImagePreview';
import { outfitService } from '@/features/outfit/services/outfitService';
import { parseISODate, formatDateDisplay } from '@/utils/dateUtils';

import type { Outfit } from '@/types/index';


/**
 * 当日搭配详情页
 * 显示特定日期的所有搭配
 */
export default function DayOutfitsPage() {
  const { date } = useParams<{ date: string }>(); // ISO date string: '2026-02-09'
  const navigate = useNavigate();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const loadOutfits = async () => {
      setLoading(true);
      try {
        const data = await outfitService.fetchOutfits();
        // 筛选出当天的搭配
        const dayOutfits = data.filter((outfit) => outfit.date === date);
        setOutfits(dayOutfits);
      } catch (error) {
        console.error('Failed to load outfits', error);
      } finally {
        setLoading(false);
      }
    };
    void loadOutfits();
  }, [date]);

  const handleAddOutfit = () => {
    void navigate('/add-outfit', { state: { prefilledDate: date } });
  };

  const handleOutfitClick = (outfitId: string) => {
    void navigate(`/outfit/edit/${outfitId}`);
  };

  const handleBack = () => {
    void navigate('/plan');
  };

  const handleDeleteOutfit = async (outfitId: string) => {
    if (window.confirm('确定要删除这个搭配吗？此操作不可撤销。')) {
      try {
        await outfitService.deleteOutfit(outfitId);
        setOutfits(outfits.filter(o => o.id !== outfitId));
      } catch (error) {
        console.error('Failed to delete outfit', error);
        alert('删除失败，请稍后重试');
      }
    }
  };

  // 格式化日期显示
  const dateDisplay = date ? formatDateDisplay(parseISODate(date)) : '';

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center bg-white dark:bg-surface-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={handleBack}
          className="text-text-main dark:text-white flex size-12 shrink-0 items-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center">
          {dateDisplay}
        </h2>
        <div className="w-12" /> {/* 占位，保持居中 */}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : outfits.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400 mb-4">这一天还没有搭配计划</p>
            <button
              type="button"
              onClick={handleAddOutfit}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              创建搭配
            </button>
          </div>
        ) : (
          <>
            {/* Header Info */}
            <div className="mb-4">
              <h3 className="text-text-main dark:text-white text-xl font-bold">
                今日搭配 ({outfits.length})
              </h3>
            </div>

            {/* Outfit List */}
            <div className="flex flex-col gap-3">
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
                  className="relative bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-shadow"
                >
                  {/* 搭配预览 */}
                  <div 
                    className="mb-3 cursor-zoom-in"
                    onClick={(e) => {
                      if (outfit.items[0]?.imageUrl) {
                        e.stopPropagation();
                        setPreviewImage(outfit.items[0].imageUrl);
                      }
                    }}
                  >
                    <OutfitPreview outfit={outfit} />
                  </div>

                  {/* 时间和场合 */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      {outfit.time || '全天'}
                    </span>
                    {outfit.season && (
                      <span className="text-gray-500 dark:text-gray-400">{outfit.season}</span>
                    )}
                  </div>

                  {/* 更多操作按钮 */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDeleteOutfit(outfit.id);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="删除搭配"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOutfitClick(outfit.id);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Ellipsis className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Image Preview */}
      {previewImage && (
        <ImagePreview 
          imageUrl={previewImage} 
          alt="搭配预览" 
          onClose={() => setPreviewImage(null)} 
        />
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={handleAddOutfit}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
        aria-label="添加搭配"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
