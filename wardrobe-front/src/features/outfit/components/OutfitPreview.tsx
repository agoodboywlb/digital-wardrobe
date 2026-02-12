import OptimizedImage from '@/components/common/OptimizedImage';

import type { Outfit } from '../../../types';

interface OutfitPreviewProps {
  outfit: Outfit;
  compact?: boolean; // 紧凑模式（日历格子用）
  isPast?: boolean;
}

/**
 * 搭配预览组件
 * 用于在日历格子中显示搭配的缩略信息
 */
export default function OutfitPreview({
  outfit,
  compact = false,
  isPast = false,
}: OutfitPreviewProps) {
  const displayItems = outfit.items.slice(0, 3); // 最多显示3件衣物

  if (compact) {
    return (
      <div
        className={`flex flex-col gap-1 ${isPast ? 'opacity-50' : ''}`}
        style={{ filter: isPast ? 'grayscale(0.5)' : 'none' }}
      >
        {/* 衣物缩略图 */}
        <div className="flex -space-x-2">
          {displayItems.map((item, index) => (
            <div
              key={item.id}
              className="relative w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 overflow-hidden"
              style={{ zIndex: displayItems.length - index }}
            >
              {item.imageUrl ? (
                <OptimizedImage
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  {item.name[0]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 场合标签 */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
            {outfit.occasion || outfit.title}
          </span>
        </div>
      </div>
    );
  }

  // 非紧凑模式 - 用于列表视图
  return (
    <div className="flex items-center gap-3">
      {/* 衣物缩略图 */}
      <div className="flex -space-x-2">
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            className="relative w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 overflow-hidden"
            style={{ zIndex: displayItems.length - index }}
          >
            {item.imageUrl ? (
              <OptimizedImage
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                {item.name[0]}
              </div>
            )}
          </div>
        ))}
        {outfit.items.length > 3 && (
          <div className="relative w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              +{outfit.items.length - 3}
            </span>
          </div>
        )}
      </div>

      {/* 搭配信息 */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">{outfit.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{outfit.occasion}</p>
      </div>
    </div>
  );
}
