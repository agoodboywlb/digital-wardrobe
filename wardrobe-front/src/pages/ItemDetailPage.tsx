import { ChevronLeft, Heart, Pencil, Tag, Shirt, ChevronRight, CircleCheck, Droplets, Utensils, Loader2, RefreshCcw, DollarSign, Calendar, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

// import { MOCK_ITEMS } from '@/utils/constants'; // REMOVED
import { wardrobeService } from '@/features/wardrobe/services/wardrobeService';
import { ItemStatus } from '@/types/index';
import { getCategoryLabel } from '@/utils/formatters';

import type { ClothingItem } from '@/types/index';
import type React from 'react';
import OptimizedImage from '@/components/common/OptimizedImage';

const ItemDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState<ClothingItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Local state for interactions
  const [currentStatus, setCurrentStatus] = useState<ItemStatus>(ItemStatus.InWardrobe);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      if (!id) { return; }
      setLoading(true);
      try {
        const data = await wardrobeService.fetchItem(id);
        if (data) {
          setItem(data);
          setCurrentStatus(data.status);
        }
      } catch (e) {
        console.error("Failed to load item", e);
      } finally {
        setLoading(false);
      }
    };
    void loadItem();
  }, [id]);

  const handleStatusChange = async (newStatus: ItemStatus) => {
    if (!item) { return; }
    setCurrentStatus(newStatus);
    // Optimistic update locally, then sync
    try {
      await wardrobeService.updateItem(item.id, { status: newStatus });
    } catch (e) {
      console.error("Status update failed", e);
    }
  };

  // Helper function to handle attribute tag toggles
  const handleToggleTag = async (attr: string) => {
    if (!item) { return; }

    const tagToToggle = `show:${attr}`;
    const newTags = item.tags.includes(tagToToggle)
      ? item.tags.filter(t => t !== tagToToggle)
      : [...item.tags, tagToToggle];

    // Optimistic update
    const previousItem = { ...item };
    setItem({ ...item, tags: newTags });

    try {
      await wardrobeService.updateItem(item.id, { tags: newTags });
    } catch (e) {
      console.error("Failed to update tags", e);
      // Revert on error
      setItem(previousItem);
    }
  };

  const handleTagClick = (label: string, value: string) => {
    if (label === '分类' || label === 'Category') {
      const targetCategory = getCategoryLabel(value) || '全部';
      void navigate('/', { state: { category: targetCategory } });
    }
  };

  const handleBack = () => {
    void navigate('/');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleEdit = () => {
    void navigate(`/item/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!item) { return; }
    if (window.confirm('确定要删除这件单品吗？此操作不可撤销。')) {
      try {
        await wardrobeService.deleteItem(item.id);
        void navigate('/', { replace: true });
      } catch (error) {
        console.error("Error deleting item", error);
        alert('删除失败，请稍后重试');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark flex-col">
        <p className="text-gray-500 mb-4">未找到该单品</p>
        <button onClick={handleBack} className="text-primary font-bold">返回首页</button>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-2 h-14">
          <button
            onClick={handleBack}
            className="flex items-center text-primary px-2 py-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-7 h-7" />
            <span className="text-[17px] font-medium">返回</span>
          </button>
          <h1 className="text-[17px] font-semibold absolute left-1/2 -translate-x-1/2">单品详情</h1>
          <div className="flex gap-2">
            <button
              onClick={toggleFavorite}
              className="p-2 text-primary hover:text-primary-dark transition-colors active:scale-90 transform"
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 text-primary hover:text-primary-dark transition-colors active:scale-90 transform"
            >
              <Pencil className="w-6 h-6" />
            </button>
            <button
              onClick={() => { void handleDelete(); }}
              className="p-2 text-red-500 hover:text-red-600 transition-colors active:scale-90 transform"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full pb-44">
        {/* Image */}
        <div className="p-4">
          <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-white dark:bg-white/5 shadow-sm">
            <OptimizedImage
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title */}
        <div className="px-5 mb-8">
          <h2 className="text-[28px] leading-tight font-bold tracking-tight mb-2 text-text-main dark:text-white">{item.name}</h2>
          <p className="text-lg text-text-secondary font-medium">
            {item.season ? `${getCategoryLabel(item.season)}系列` : '当季系列'} / {item.tags && item.tags[0] ? item.tags[0] : '日常'}
          </p>
        </div>

        {/* List Details */}
        <div className="px-5 space-y-2">
          {[
            { label: '品牌', value: item.brand || '无品牌', icon: Tag, key: 'brand' },
            { label: '分类', value: item.category, icon: Shirt, key: 'category', isInteractable: true },
            { label: '季节', value: item.season || '未设置', icon: Tag, key: 'season' },
            { label: '尺码', value: item.size || '均码', icon: Tag, key: 'size' },
            { label: '材质', value: item.material || '未知材质', icon: Shirt, key: 'material' },
            {
              label: '价格',
              value: item.price ? `¥${item.price}` : '未录入',
              icon: DollarSign,
              key: 'price'
            },
            { label: '购入日期', value: item.purchaseDate || '未知', icon: Calendar, active: false },
            {
              label: '上次穿着',
              value: item.lastWorn || '从未',
              icon: RefreshCcw,
              active: false,
              customValue: (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary font-sans"></span>
                  <span className="text-[18px] font-semibold text-text-main dark:text-white">{item.lastWorn ? item.lastWorn.split('T')[0] : '从未'}</span>
                </div>
              )
            },
            {
              label: '标签',
              value: item.tags.filter(t => !t.startsWith('show:')).join(' / ') || '无',
              icon: Tag,
              active: item.tags.filter(t => !t.startsWith('show:')).length > 0
            },
          ].map((detail, idx) => {
            const isAttribute = !!detail.key;
            const isActive = isAttribute ? item.tags.includes(`show:${detail.key}`) : detail.active;

            return (
              <div
                key={idx}
                className={`flex items-center py-5 border-b border-gray-100 dark:border-gray-800 group`}
              >
                <button
                  type="button"
                  disabled={!isAttribute}
                  onClick={() => { if (isAttribute && detail.key) { void handleToggleTag(detail.key); } }}
                  className={`mr-4 transition-all duration-300 p-1 -ml-1 rounded-md ${isAttribute ? 'hover:bg-primary/10 active:scale-90' : ''} ${isActive ? 'text-primary' : 'text-gray-300'}`}
                >
                  <detail.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                </button>
                <div
                  role="button"
                  tabIndex={0}
                  className={`flex-1 flex justify-between items-center ${(detail.isInteractable || detail.active) ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if ((detail.isInteractable || detail.active) && typeof detail.value === 'string') {
                      handleTagClick(detail.label, detail.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if ((detail.isInteractable || detail.active) && typeof detail.value === 'string') {
                        handleTagClick(detail.label, detail.value);
                      }
                    }
                  }}
                >
                  <span className="text-[16px] text-text-secondary font-medium">{detail.label}</span>
                  {detail.customValue ? detail.customValue : (
                    <span className={`text-[16px] font-semibold text-text-main dark:text-white capitalize flex items-center gap-1`}>
                      {(detail.label === '分类' || detail.label === '季节') ? (
                        getCategoryLabel(detail.value)
                      ) : (detail.label === '购入日期' && typeof detail.value === 'string' && detail.value !== '未知') ? detail.value.split('T')[0] : detail.value}
                      {(detail.isInteractable || detail.active) && <ChevronRight className="w-4 h-4 text-gray-300" />}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Care Instructions */}
        <div className="px-5 mt-10">
          <h3 className="text-sm font-bold tracking-wider text-gray-400 mb-4 uppercase">护理建议</h3>
          <div className="p-5 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
            <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">
              请参考洗标进行洗涤。通常建议分类洗涤，避免染色。
            </p>
          </div>
        </div>

        {/* Related Link */}
        <div className="mt-8 px-5">
          <Link to={`/related/${item.id}`} className="w-full flex items-center justify-between py-6 border-t border-b border-gray-100 dark:border-gray-800 group">
            <div className="flex items-center gap-4">
              <Shirt className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
              <span className="text-[16px] font-medium text-text-main dark:text-white">相关搭配</span>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
          </Link>
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 px-4 pt-4 pb-8 z-50">
        <div className="max-w-md mx-auto">
          <h3 className="text-[12px] font-bold tracking-widest text-text-secondary mb-4 text-center uppercase">当前状态</h3>
          <div className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-xl gap-2">
            <button
              type="button"
              onClick={() => { void handleStatusChange(ItemStatus.InWardrobe); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold shadow-sm transition-all duration-200 active:scale-95 ${currentStatus === ItemStatus.InWardrobe
                ? 'bg-primary text-text-main shadow-md'
                : 'bg-white dark:bg-white/5 text-gray-400 dark:text-gray-500 hover:bg-gray-50'
                }`}
            >
              <CircleCheck className={`w-5 h-5 ${currentStatus === ItemStatus.InWardrobe ? 'text-text-main' : 'text-gray-400'}`} />
              <span className="text-[16px]">干净</span>
            </button>

            <button
              type="button"
              onClick={() => { void handleStatusChange(ItemStatus.ToWash); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold shadow-sm transition-all duration-200 active:scale-95 ${currentStatus === ItemStatus.ToWash
                ? 'bg-primary text-text-main shadow-md'
                : 'bg-white dark:bg-white/5 text-gray-400 dark:text-gray-500 hover:bg-gray-50'
                }`}
            >
              <Droplets className={`w-5 h-5 ${currentStatus === ItemStatus.ToWash ? 'text-text-main' : 'text-gray-400'}`} />
              <span className="text-[16px]">待洗</span>
            </button>

            <button
              type="button"
              onClick={() => { void handleStatusChange(ItemStatus.DryCleaning); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold shadow-sm transition-all duration-200 active:scale-95 ${currentStatus === ItemStatus.DryCleaning
                ? 'bg-primary text-text-main shadow-md'
                : 'bg-white dark:bg-white/5 text-gray-400 dark:text-gray-500 hover:bg-gray-50'
                }`}
            >
              <Utensils className={`w-5 h-5 ${currentStatus === ItemStatus.DryCleaning ? 'text-text-main' : 'text-gray-400'}`} />
              <span className="text-[16px]">干洗</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ItemDetailPage;