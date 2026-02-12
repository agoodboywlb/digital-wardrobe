import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CalendarGrid from './CalendarGrid';
import CalendarHeader from './CalendarHeader';
import {
  getPreviousMonth,
  getNextMonth,
  getCalendarData,
  formatDateISO,
} from '../../../utils/dateUtils';

import type { Outfit } from '../../../types';

interface CalendarViewProps {
  outfits: Outfit[];
}

/**
 * 日历视图容器组件
 * 管理日历状态和交互逻辑
 */
export default function CalendarView({ outfits }: CalendarViewProps) {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // 获取日历数据
  const calendarData = getCalendarData(currentMonth, outfits);

  // 月份导航
  const handlePrevMonth = () => {
    setCurrentMonth(getPreviousMonth(currentMonth));
  };

  const handleNextMonth = () => {
    setCurrentMonth(getNextMonth(currentMonth));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  // 点击日期格子
  const handleDayClick = (date: Date, hasOutfits: boolean) => {
    const dateStr = formatDateISO(date);

    if (hasOutfits) {
      // 有搭配 - 跳转到当日详情页
      void navigate(`/plan/day/${dateStr}`);
    } else {
      // 空日期 - 跳转到创建搭配页面，预填日期
      void navigate('/add-outfit', { state: { prefilledDate: dateStr } });
    }
  };

  return (
    <div className="w-full">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <CalendarGrid calendarData={calendarData} onDayClick={handleDayClick} />
    </div>
  );
}
