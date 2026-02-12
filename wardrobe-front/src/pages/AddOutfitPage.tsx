import { ChevronLeft, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { outfitService } from '@/features/outfit/services/outfitService';
import { wardrobeService } from '@/features/wardrobe/services/wardrobeService';

import type { ClothingItem } from '@/types/index';
import type React from 'react';

interface LocationState {
  prefilledDate?: string;
}

const AddOutfitPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const prefilledDate = state?.prefilledDate; // 从日历视图传递的预填日期
  const [step, setStep] = useState<'details' | 'items'>('details');

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(prefilledDate || new Date().toISOString().split('T')[0]);
  const [occasion, setOccasion] = useState('日常');
  const [season] = useState('spring');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Data State
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const items = await wardrobeService.fetchItems();
        setWardrobeItems(items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void loadItems();
  }, []);

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!title) {
      alert('请输入搭配名称');
      return;
    }
    if (selectedItemIds.length === 0) {
      alert('请至少选择一件单品');
      return;
    }

    setSaving(true);
    try {
      await outfitService.createOutfit({
        title,
        date,
        occasion,
        season,
        status: 'planned',
        itemIds: selectedItemIds,
      });
      void navigate('/plan');
    } catch (error) {
      console.error(error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center bg-white dark:bg-surface-dark p-4 justify-between sticky top-0 z-30 border-b border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={() => {
            if (step === 'items') {
              setStep('details');
            } else {
              void navigate(-1);
            }
          }}
          className="text-text-main dark:text-white flex items-center"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-sm font-medium">{step === 'items' ? '上一步' : '取消'}</span>
        </button>
        <h2 className="text-lg font-bold">创建搭配</h2>
        <button
          type="button"
          onClick={() => {
            if (step === 'details') {
              setStep('items');
            } else {
              void handleSave();
            }
          }}
          disabled={saving}
          className="text-primary font-bold text-sm"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : step === 'details' ? (
            '下一步'
          ) : (
            '完成'
          )}
        </button>
      </div>

      {/* Step 1: Details */}
      {step === 'details' && (
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <label htmlFor="outfit-title" className="text-sm font-bold text-text-secondary">搭配名称</label>
            <input
              id="outfit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：周五休闲装"
              className="w-full p-4 rounded-xl bg-white dark:bg-surface-dark border-none focus:ring-2 focus:ring-primary outline-none text-text-main dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="outfit-date" className="text-sm font-bold text-text-secondary">日期</label>
            <input
              id="outfit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 rounded-xl bg-white dark:bg-surface-dark border-none focus:ring-2 focus:ring-primary outline-none text-text-main dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-bold text-text-secondary">场合</span>
            <div className="flex flex-wrap gap-2">
              {['日常', '工作', '约会', '运动', '度假'].map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${occasion === occ ? 'bg-primary text-text-main' : 'bg-white dark:bg-surface-dark text-text-secondary'}`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Select Items */}
      {step === 'items' && (
        <div className="p-4">
          <p className="text-sm text-text-secondary mb-4">已选择 {selectedItemIds.length} 件单品</p>
          {wardrobeItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-400 mb-2">衣橱里还没有单品</p>
              <button
                type="button"
                onClick={() => { void navigate('/add'); }}
                className="text-primary font-bold text-sm"
              >
                去添加单品 →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {wardrobeItems.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleItemSelection(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleItemSelection(item.id);
                      }
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-1">
                      <p className="text-[10px] text-white truncate text-center">{item.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddOutfitPage;

