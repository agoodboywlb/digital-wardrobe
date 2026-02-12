import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday as isTodayFn,
  isPast as isPastFn,
  isSameMonth,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';

import type { Outfit } from '../types';

/**
 * 生成日历网格数据（6周 x 7天 = 42个格子）
 * 周一作为一周的开始
 */
export function generateCalendarDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 }); // 周一开始
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

/**
 * 按日期分组搭配
 * @returns Record<string, Outfit[]> - key 为 ISO 日期字符串 '2026-02-09'
 */
export function groupOutfitsByDate(outfits: Outfit[]): Record<string, Outfit[]> {
  return outfits.reduce(
    (acc, outfit) => {
      if (!outfit.date) {return acc;}
      const key = outfit.date; // ISO string: '2026-02-09'
      if (!acc[key]) {acc[key] = [];}
      acc[key].push(outfit);
      return acc;
    },
    {} as Record<string, Outfit[]>
  );
}

/**
 * 格式化月份年份: '2026年2月'
 */
export function formatMonthYear(date: Date): string {
  return format(date, 'yyyy年M月', { locale: zhCN });
}

/**
 * 格式化日期数字: '9'
 */
export function formatDayNumber(date: Date): string {
  return format(date, 'd');
}

/**
 * 格式化完整日期: '2026-02-09'
 */
export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * 格式化显示日期: '2月9日'
 */
export function formatDateDisplay(date: Date): string {
  return format(date, 'M月d日', { locale: zhCN });
}

/**
 * 格式化星期: '周一'
 */
export function formatWeekday(date: Date): string {
  return format(date, 'EEEEEE', { locale: zhCN }); // 'EEEEEE' 输出 '一', '二', ...
}

/**
 * 判断是否是今天
 */
export function isToday(date: Date): boolean {
  return isTodayFn(date);
}

/**
 * 判断是否是过去
 */
export function isPast(date: Date): boolean {
  return isPastFn(date) && !isToday(date);
}

/**
 * 判断两个日期是否是同一天
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

/**
 * 判断日期是否在当前月份
 */
export function isDateInMonth(date: Date, month: Date): boolean {
  return isSameMonth(date, month);
}

/**
 * 获取上个月
 */
export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1);
}

/**
 * 获取下个月
 */
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

/**
 * 解析 ISO 日期字符串为 Date 对象
 */
export function parseISODate(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * 获取日历数据
 * 将日期和搭配数据组合
 */
export interface CalendarDayData {
  date: Date;
  outfits: Outfit[];
  isToday: boolean;
  isPast: boolean;
  isCurrentMonth: boolean;
}

export function getCalendarData(currentMonth: Date, outfits: Outfit[]): CalendarDayData[] {
  const calendarDays = generateCalendarDays(currentMonth);
  const outfitsByDate = groupOutfitsByDate(outfits);

  return calendarDays.map((day) => ({
    date: day,
    outfits: outfitsByDate[formatDateISO(day)] || [],
    isToday: isToday(day),
    isPast: isPast(day),
    isCurrentMonth: isDateInMonth(day, currentMonth),
  }));
}
