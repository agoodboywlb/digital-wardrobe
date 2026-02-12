import { Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

import OptimizedImage from '@/components/common/OptimizedImage';
import { ItemStatus } from '@/types/index';
import { getCategoryLabel } from '@/utils/formatters';

import type { ClothingItem } from '@/types/index';
import type React from 'react';

interface WardrobeItemCardProps {
    item: ClothingItem;
}

const statusLabels: Record<string, string> = {
    [ItemStatus.InWardrobe]: '在柜',
    [ItemStatus.ToWash]: '待洗',
    [ItemStatus.AtTailor]: '修改中',
    [ItemStatus.DryCleaning]: '干洗中',
};



const WardrobeItemCard: React.FC<WardrobeItemCardProps> = ({ item }) => {
    return (
        <Link to={`/item/${item.id}`} className="group relative bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 pb-3 hover:shadow-md transition-all active:scale-[0.98]">
            <div className="aspect-[4/5] bg-gray-100 dark:bg-white/5 relative overflow-hidden">
                <OptimizedImage
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                {item.status !== ItemStatus.InWardrobe && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                            {statusLabels[item.status] || ''}
                        </span>
                    </div>
                )}
            </div>
            <div className="px-3 pt-3 pb-2">
                <h3 className="text-sm font-bold text-text-main dark:text-white truncate leading-tight mb-2">{item.name}</h3>
                <div className="flex flex-wrap gap-1.5 min-h-[1.5rem] content-start overflow-hidden">
                    {item.tags.includes('show:brand') && (
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/10 px-1.5 py-1 rounded-md max-w-full">
                            <Tag className="w-3 h-3 text-primary shrink-0 fill-current" />
                            <span className="text-[10px] font-bold text-text-secondary truncate">{item.brand || '无品牌'}</span>
                        </div>
                    )}

                    {item.tags.includes('show:category') && (
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/10 px-1.5 py-1 rounded-md">
                            <span className="text-[10px] font-bold text-text-secondary">{getCategoryLabel(item.category)}</span>
                        </div>
                    )}

                    {item.tags.includes('show:size') && (
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/10 px-1.5 py-1 rounded-md">
                            <span className="text-[10px] font-bold text-text-secondary">{(item.size || '均码').split(' ')[0]}</span>
                        </div>
                    )}

                    {item.tags.includes('show:material') && (
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/10 px-1.5 py-1 rounded-md">
                            <span className="text-[10px] font-bold text-text-secondary truncate">{item.material || '未知材质'}</span>
                        </div>
                    )}

                    {/* Show other user-defined tags that are not technical 'show:' tags */}
                    {item.tags.filter(t => !t.startsWith('show:')).map((tag, i) => (
                        <div key={i} className="flex items-center gap-1 bg-primary/10 px-1.5 py-1 rounded-md">
                            <span className="text-[10px] font-bold text-primary">{tag}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default WardrobeItemCard;
