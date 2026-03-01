import { ChevronLeft, CircleCheck, ChevronDown, Loader2, Trash2, Tag as TagIcon, Calendar, DollarSign, Info, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Skeleton } from '@/components/ui/Skeleton';
import { Tag } from '@/components/ui/Tag';
import MultiImageUploader from '@/components/common/MultiImageUploader';
import { wardrobeService } from '@/features/wardrobe/services/wardrobeService';
import { ItemStatus } from '@/types/index';

import type { MultiImageFile } from '@/components/common/MultiImageUploader';
import type { ClothingItem, Category } from '@/types/index';
import type React from 'react';

const EditItemPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState<ClothingItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
    const [status, setStatus] = useState<ItemStatus>(ItemStatus.InWardrobe);

    // Multi-image state
    const [images, setImages] = useState<MultiImageFile[]>([]);

    useEffect(() => {
        const loadItem = async () => {
            if (!id) { return; }
            setLoading(true);
            try {
                const data = await wardrobeService.fetchItem(id);
                if (data) {
                    setItem(data);
                    setName(data.name);
                    setSelectedCategory(data.category);
                    setBrand(data.brand || '');
                    setSize(data.size || '');
                    setMaterial(data.material || '');
                    setPrice(data.price?.toString() || '');
                    setPurchaseDate(data.purchaseDate || '');
                    setLastWorn(data.lastWorn || '');
                    setStatus(data.status);

                    // Initialize multi-image state
                    if (data.images && data.images.length > 0) {
                        setImages(data.images.map(img => ({
                            id: img.id,
                            url: img.imageUrl,
                            isPrimary: img.isPrimary,
                            dbId: img.id
                        })));
                    } else if (data.imageUrl) {
                        setImages([{
                            id: 'legacy-main',
                            url: data.imageUrl,
                            isPrimary: true
                        }]);
                    }

                    if (data.season) {
                        setSelectedSeason(data.season);
                    }
                    if (data.tags) {
                        setTags(data.tags.filter(t => !t.startsWith('show:')).join('，'));
                    }
                }
            } catch (err) {
                console.error("Failed to load item", err);
            } finally {
                setLoading(false);
            }
        };
        void loadItem();
    }, [id]);

    const handleSave = async () => {
        if (!id || !name || !selectedCategory) {
            alert('请填写名称和分类');
            return;
        }

        setSaving(true);
        try {
            // 1. Detect and delete removed images
            const originalImageIds = item?.images?.map(img => img.id) || [];
            const currentImageDbIds = images.filter(img => img.dbId).map(img => img.dbId);
            const toDelete = originalImageIds.filter(oid => !currentImageDbIds.includes(oid));

            await Promise.all(toDelete.map(imgId => wardrobeService.deleteItemImage(imgId, id)));

            // 2. Upload and add new images
            await Promise.all(images.map(async (img) => {
                if (img.file) {
                    const url = await wardrobeService.uploadImage(img.file);
                    await wardrobeService.addItemImage(id, url);
                }
            }));

            // 3. Update primary and reorder (Fetch again to get all current DB IDs)
            const updatedItem = await wardrobeService.fetchItem(id);
            if (updatedItem?.images) {
                const intendedPrimary = images.find(img => img.isPrimary);
                const dbPrimary = updatedItem.images.find(img => img.imageUrl === intendedPrimary?.url);

                if (dbPrimary) {
                    await wardrobeService.setPrimaryImage(dbPrimary.id, id);
                }

                const sortedIds = images.map(stateImg => {
                    const match = updatedItem.images?.find(dbImg => dbImg.imageUrl === stateImg.url);
                    return match?.id;
                }).filter(Boolean) as string[];

                if (sortedIds.length > 0) {
                    await wardrobeService.reorderImages(sortedIds);
                }
            }

            // 4. Update basic info
            const primaryImage = images.find(img => img.isPrimary) || images[0];
            const mainImageUrl = primaryImage?.url || '';

            await wardrobeService.updateItem(id, {
                name,
                category: selectedCategory as Category,
                brand: brand || undefined,
                size: size || undefined,
                material: material || undefined,
                price: price ? parseFloat(price) : undefined,
                purchaseDate: purchaseDate || undefined,
                lastWorn: lastWorn || undefined,
                imageUrl: mainImageUrl,
                status,
                season: selectedSeason || undefined,
                tags: [
                    ...(item?.tags.filter(t => t.startsWith('show:')) || []),
                    ...tags.split(/[,，]/).map(t => t.trim()).filter(t => t !== '')
                ]
            });

            void navigate(`/item/${id}`, { replace: true });
        } catch (error) {
            console.error("Error updating item", error);
            alert('保存失败，请重试');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id) { return; }
        if (window.confirm('确定要删除这件单品吗？此操作不可撤销。')) {
            setSaving(true);
            try {
                await wardrobeService.deleteItem(id);
                void navigate('/', { replace: true });
            } catch (error) {
                console.error("Error deleting item", error);
                alert('删除失败');
                setSaving(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden">
                <header className="flex items-center bg-white dark:bg-surface-dark px-4 h-14 justify-between sticky top-0 z-30 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-10" />
                    <Skeleton className="h-6 w-24" />
                    <div className="w-10" />
                </header>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div>
                        <Skeleton className="h-4 w-32 mb-3" />
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-xl" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-14 w-full rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!item) { return null; }

    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden">
            <header className="flex items-center bg-white dark:bg-surface-dark px-4 h-14 justify-between sticky top-0 z-30 border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => { void navigate(-1); }} className="text-text-main dark:text-white flex size-10 items-center justify-start">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-text-main dark:text-white text-[17px] font-bold flex-1 text-center">编辑单品</h2>
                <button onClick={() => { void handleDelete(); }} className="size-10 flex items-center justify-end text-red-500">
                    <Trash2 className="w-5 h-5" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto pb-32">
                <div className="p-4">
                    <label className="flex items-center gap-2 text-text-secondary text-xs font-bold mb-3 uppercase tracking-wider px-1">
                        单品图片管理 (最多 8 张)
                    </label>
                    <MultiImageUploader
                        images={images}
                        onImagesChange={setImages}
                    />
                </div>

                <div className="px-4 space-y-6">
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
                                placeholder="单品名称"
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
                                        <option value="">未设置</option>
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

                    <section className="space-y-4">
                        <label htmlFor="item-brand" className="flex items-center gap-2 text-text-secondary text-xs font-bold mb-2 uppercase tracking-wider px-1">
                            <Tag className="w-3.5 h-3.5" /> 属性详情
                        </label>
                        <div className="bg-white dark:bg-white/5 rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800 overflow-hidden">
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

                    <section className="space-y-4">
                        <button
                            type="button"
                            onClick={() => setShowMore(!showMore)}
                            className="w-full flex items-center justify-between py-2 px-1 group"
                        >
                            <span className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-wider cursor-pointer group-hover:text-primary transition-colors">
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMore ? 'rotate-180' : ''}`} /> 更多细节 (价格、日期等)
                            </span>
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
                                <div className="flex items-center shadow-sm">
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
                                <div className="flex items-center shadow-sm">
                                    <div className="w-12 flex justify-center text-text-secondary">
                                        <TagIcon className="w-4 h-4" />
                                    </div>
                                    <label htmlFor="item-tags" className="text-[10px] font-bold text-gray-400 w-16">自定义标签</label>
                                    <div className="flex-1 p-4 flex flex-wrap gap-2">
                                        {tags.split(/[,，]/).map(t => t.trim()).filter(t => t !== '').map((tag, i) => (
                                            <Tag key={i} type="custom" className="bg-primary/20 text-primary">
                                                {tag}
                                            </Tag>
                                        ))}
                                        <input
                                            id="item-tags"
                                            type="text"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            className="flex-1 bg-transparent outline-none text-sm font-medium min-w-[100px]"
                                            placeholder="用逗号分隔，如：通勤, 复古"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-white/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pb-8 z-40">
                <button
                    type="button"
                    onClick={() => { void handleSave(); }}
                    disabled={saving}
                    className="w-full h-14 bg-primary text-slate-900 font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70">
                    {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span>保存更改</span>
                            <CircleCheck className="w-5 h-5" />
                        </>
                    )}
                </button>
            </footer>
        </div>
    );
};

export default EditItemPage;
