import { ChevronLeft, ChevronRight } from 'lucide-react';

import { formatMonthYear, isDateInMonth } from '../../../utils/dateUtils';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

/**
 * 日历头部组件
 * 显示月份导航和"今天"按钮
 */
export default function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  const today = new Date();
  const isCurrentMonth = isDateInMonth(today, currentMonth);

  return (
    <div className="flex items-center justify-between mb-4">
      {/* 月份导航 */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="上个月"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[120px] text-center">
          {formatMonthYear(currentMonth)}
        </h2>

        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="下个月"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* 今天按钮 - 仅当不在当前月份时显示 */}
      {!isCurrentMonth && (
        <button
          onClick={onToday}
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          今天
        </button>
      )}
    </div>
  );
}
