import { Plus } from 'lucide-react';

import OutfitPreview from './OutfitPreview';
import { formatDayNumber } from '../../../utils/dateUtils';

import type { Outfit } from '../../../types';

interface CalendarDayCellProps {
  date: Date;
  outfits: Outfit[];
  isToday: boolean;
  isPast: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

/**
 * 日历日期格子组件
 * 显示单个日期及其关联的搭配
 */
export default function CalendarDayCell({
  date,
  outfits,
  isToday,
  isPast,
  isCurrentMonth,
  onClick,
}: CalendarDayCellProps) {
  const hasOutfits = outfits.length > 0;
  const firstOutfit = outfits[0];
  const extraCount = outfits.length - 1;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      className={`
        min-h-[80px] p-2 border border-gray-200 dark:border-gray-700 
        cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800
        ${isToday ? 'border-2 border-blue-500 dark:border-blue-400' : ''}
        ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-850'}
        ${isPast ? 'opacity-60' : ''}
      `}
    >
      {/* 日期数字 */}
      <div className="flex items-start justify-between mb-1">
        <span
          className={`
            text-sm font-medium
            ${isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}
            ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}
          `}
        >
          {formatDayNumber(date)}
        </span>

        {/* 多个搭配角标 */}
        {extraCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-full">
            +{extraCount}
          </span>
        )}
      </div>

      {/* 搭配内容 */}
      {hasOutfits && firstOutfit ? (
        <div className="mt-1">
          <OutfitPreview outfit={firstOutfit} compact isPast={isPast} />
        </div>
      ) : (
        /* 空日期 - 显示添加提示 */
        <div className="flex items-center justify-center h-12 opacity-0 hover:opacity-100 transition-opacity">
          <Plus className="w-5 h-5 text-gray-400 dark:text-gray-600" />
        </div>
      )}
    </div>
  );
}
