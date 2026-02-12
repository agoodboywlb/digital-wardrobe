import CalendarDayCell from './CalendarDayCell';

import type { CalendarDayData } from '../../../utils/dateUtils';

interface CalendarGridProps {
  calendarData: CalendarDayData[];
  onDayClick: (date: Date, hasOutfits: boolean) => void;
}

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

/**
 * 日历网格组件
 * 渲染星期行和日期格子
 */
export default function CalendarGrid({ calendarData, onDayClick }: CalendarGridProps) {
  return (
    <div className="w-full">
      {/* 星期行 */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 mb-px">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="bg-gray-100 dark:bg-gray-800 py-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 (6周 x 7天) */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {calendarData.map((dayData, index) => (
          <CalendarDayCell
            key={`${dayData.date.toISOString()}-${index}`}
            date={dayData.date}
            outfits={dayData.outfits}
            isToday={dayData.isToday}
            isPast={dayData.isPast}
            isCurrentMonth={dayData.isCurrentMonth}
            onClick={() => onDayClick(dayData.date, dayData.outfits.length > 0)}
          />
        ))}
      </div>
    </div>
  );
}
