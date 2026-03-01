import { ChevronLeft, CircleCheck, ChevronDown, Loader2, Info, Tag as TagIcon, Calendar, DollarSign, RefreshCcw, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MultiImageUploader from '@/components/common/MultiImageUploader';
import { Tag } from '@/components/ui/Tag';
import { wardrobeService } from '@/features/wardrobe/services/wardrobeService';
import { buildTagRecommendations, mergeTagIntoInput, parseCustomTags } from '@/features/wardrobe/utils/tagRecommendations';
import { ItemStatus } from '@/types/index';

import type { Category } from '@/types/index';
import type React from 'react';

const AddItemPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [material, setMaterial] = useState('');
  const [price, setPrice] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [lastWorn, setLastWorn] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [recommendedTags, setRecommendedTags] = useState<string[]>([]);

  // Multi-image state
  const [images, setImages] = useState<any[]>([]);
  const selectedCustomTags = parseCustomTags(tags);
  const selectedTagKeys = new Set(selectedCustomTags.map((tag) => tag.toLocaleLowerCase()));
  const visibleRecommendedTags = recommendedTags.filter((tag) => !selectedTagKeys.has(tag.toLocaleLowerCase()));

  useEffect(() => {
    let active = true;

    const loadRecommendations = async () => {
      try {
        const items = await wardrobeService.fetchItems();
        if (!active) {
          return;
        }
        setRecommendedTags(buildTagRecommendations(items, { limit: 12 }));
      } catch (error) {
        console.error('Failed to load tag recommendations', error);
      }
    };

    void loadRecommendations();

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    if (!name || !selectedCategory) {
      alert('请填写名称和分类');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload all images
      const uploadPromises = images.map(async (img) => {
        if (img.file) {
          const url = await wardrobeService.uploadImage(img.file);
          return { ...img, url };
        }
        return img;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const primaryImage = uploadedImages.find(img => img.isPrimary) || uploadedImages[0];
      const mainImageUrl = primaryImage?.url || 'https://via.placeholder.com/400x400?text=No+Image';

      // 2. Create the item
      const newItem = await wardrobeService.addItem({
        name,
        category: selectedCategory as Category,
        brand: brand || undefined,
        size: size || undefined,
        material: material || undefined,
        price: price ? parseFloat(price) : undefined,
        purchaseDate: purchaseDate || undefined,
        lastWorn: lastWorn || undefined,
        imageUrl: mainImageUrl,
        status: ItemStatus.InWardrobe,
        season: selectedSeason || undefined,
        tags: parseCustomTags(tags),
        wearCount: 0
      });

      // 3. Save all images to item_images table
      const imgPromises = uploadedImages.map((img) =>
        wardrobeService.addItemImage(newItem.id, img.url, undefined)
      );
      // Note: addItemImage already handles first image as primary in its current implementation,
      // but since we want to be explicit about our UI order:
      // We might need a batch version for better performance, but sequential is fine for now.
      await Promise.all(imgPromises);

      void navigate('/');
    } catch (error) {
      console.error("Error saving item", error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Header */}
      <header className="flex items-center bg-white dark:bg-surface-dark px-4 h-14 justify-between sticky top-0 z-30 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => { void navigate(-1); }} className="text-text-main dark:text-white flex size-10 items-center justify-start">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-text-main dark:text-white text-[17px] font-bold flex-1 text-center">添加单品</h2>
        <div className="size-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Multi-Image Area */}
        <div className="p-4">
          <label className="flex items-center gap-2 text-text-secondary text-xs font-bold mb-3 uppercase tracking-wider px-1">
            相机拍照 / 上传图片
          </label>
          <MultiImageUploader
            images={images}
            onImagesChange={setImages}
          />
        </div>

        {/* Form Fields */}
        <div className="px-4 space-y-6">
          {/* Basic Info */}
          <section className="space-y-4">
            <div>
              <label htmlFor="item-name" className="flex items-center gap-2 text-text-secondary text-xs font-bold mb-2 uppercase tracking-wider px-1">
                <Info className="w-3.5 h-3.5" /> 基础信息
              </label>
              <input
                id="item-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900/50 p-4 outline-none focus:ring-2 focus:ring-primary transition-all text-base font-medium"
                placeholder="例如：复古牛仔夹克"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="item-category" className="block text-text-secondary text-[10px] font-bold mb-1.5 uppercase ml-1">分类</label>
                <div className="relative">
                  <select
                    id="item-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900/50 p-3.5 appearance-none outline-none focus:ring-2 focus:ring-primary text-sm font-semibold"
                  >
                    <option value="" disabled>选择分类</option>
                    <option value="tops">上装</option>
                    <option value="bottoms">裤装</option>
                    <option value="outerwear">外套</option>
                    <option value="footwear">鞋履</option>
                    <option value="accessories">配饰</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label htmlFor="item-season" className="block text-text-secondary text-[10px] font-bold mb-1.5 uppercase ml-1">季节</label>
                <div className="relative">
                  <select
                    id="item-season"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="block w-full rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900/50 p-3.5 appearance-none outline-none focus:ring-2 focus:ring-primary text-sm font-semibold"
                  >
                    <option value="">选择季节</option>
                    <option value="spring">春季</option>
                    <option value="summer">夏季</option>
                    <option value="autumn">秋季</option>
                    <option value="winter">冬季</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Detailed Attributes */}
          <section className="space-y-4">
            <label htmlFor="item-brand" className="flex items-center gap-2 text-text-secondary text-xs font-bold mb-2 uppercase tracking-wider px-1">
              <TagIcon className="w-3.5 h-3.5" /> 属性详情
            </label>
            <div className="bg-white dark:bg-white/5 rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800 overflow-hidden shadow-sm">
              <div className="flex items-center border-b border-gray-50 dark:border-gray-800">
                <span className="w-20 pl-4 text-xs font-bold text-text-secondary">品牌</span>
                <input
                  id="item-brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="flex-1 p-4 bg-transparent outline-none text-sm font-medium"
                  placeholder="输入品牌"
                />
              </div>
              <div className="flex items-center border-b border-gray-50 dark:border-gray-800">
                <span className="w-20 pl-4 text-xs font-bold text-text-secondary">尺码</span>
                <input
                  id="item-size"
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="flex-1 p-4 bg-transparent outline-none text-sm font-medium"
                  placeholder="输入尺码"
                />
              </div>
              <div className="flex items-center">
                <span className="w-20 pl-4 text-xs font-bold text-text-secondary">材质</span>
                <input
                  id="item-material"
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="flex-1 p-4 bg-transparent outline-none text-sm font-medium"
                  placeholder="输入材质"
                />
              </div>
            </div>
          </section>

          {/* Expandable Section: More Details */}
          <section className="space-y-4">
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="w-full flex items-center justify-between py-2 px-1 group"
            >
              <span className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-wider cursor-pointer group-hover:text-primary transition-colors font-sans">
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMore ? 'rotate-180' : ''}`} /> 更多细节 (价格、日期等)
              </span>
              {!showMore && <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">扩展</span>}
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showMore ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="bg-white dark:bg-white/5 rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800 space-y-0 shadow-sm mb-4">
                <div className="flex items-center border-b border-gray-50 dark:border-gray-800">
                  <div className="w-12 flex justify-center text-text-secondary">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <label htmlFor="item-price" className="text-[10px] font-bold text-gray-400 w-16">价格</label>
                  <input
                    id="item-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="flex-1 p-4 bg-transparent outline-none text-sm font-medium"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-center border-b border-gray-50 dark:border-gray-800">
                  <div className="w-12 flex justify-center text-text-secondary">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <label htmlFor="item-purchase-date" className="text-[10px] font-bold text-gray-400 w-16">购入日期</label>
                  <input
                    id="item-purchase-date"
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="flex-1 p-4 bg-transparent outline-none text-sm font-medium"
                  />
                </div>
                <div className="flex items-center">
                  <div className="w-12 flex justify-center text-text-secondary">
                    <RefreshCcw className="w-4 h-4" />
                  </div>
                  <label htmlFor="item-last-worn" className="text-[10px] font-bold text-gray-400 w-16">上次穿着</label>
                  <input
                    id="item-last-worn"
                    type="date"
                    value={lastWorn}
                    onChange={(e) => setLastWorn(e.target.value)}
                    className="flex-1 p-4 bg-transparent outline-none text-sm font-medium"
                  />
                </div>
                <div className="flex items-center">
                  <div className="w-12 flex justify-center text-text-secondary">
                    <TagIcon className="w-4 h-4" />
                  </div>
                  <label htmlFor="item-tags" className="text-[10px] font-bold text-gray-400 w-16">自定义标签</label>
                  <input
                    id="item-tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="flex-1 p-4 bg-transparent outline-none text-sm font-medium"
                    placeholder="用逗号分隔，如：通勤, 复古"
                  />
                </div>
                {visibleRecommendedTags.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-50 dark:border-gray-800">
                    <p className="text-[10px] font-bold text-gray-400 mb-2">快速打标</p>
                    <div className="flex flex-wrap gap-2">
                      {visibleRecommendedTags.slice(0, 8).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setTags((current) => mergeTagIntoInput(current, tag))}
                          className="active:scale-[0.98] transition-transform"
                        >
                          <Tag type="custom" className="bg-primary/20 text-primary hover:bg-primary/30">
                            {tag}
                          </Tag>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 px-2 leading-relaxed">
                完善这些信息可以帮助我们为您提供更准确的衣橱统计，或者添加自定义分类标签。
              </p>
            </div>
          </section>

          {/* New Field Entry Point (Future) */}
          <div className="py-4 flex justify-center">
            <button type="button" className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-colors py-2 px-4 rounded-full bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-gray-800">
              <Plus className="w-3.5 h-3.5" />
              <span>请求增加更多字段...</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-white/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pb-8 z-40">
        <button
          type="button"
          onClick={() => { void handleSave(); }}
          disabled={loading}
          className="w-full h-14 bg-primary text-slate-900 font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>保存至衣橱</span>
              <CircleCheck className="w-5 h-5" />
            </>
          )}
        </button>
      </footer>
    </div>
  );
};

export default AddItemPage;
