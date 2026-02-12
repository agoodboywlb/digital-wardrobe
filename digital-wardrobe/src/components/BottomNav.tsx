import { Package, CalendarDays, ChartPie, Settings, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import type React from 'react';

const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Package, label: '衣橱' },
    { to: '/assistant', icon: Sparkles, label: '助手' },
    { to: '/plan', icon: CalendarDays, label: '搭配' },
    { to: '/stats', icon: ChartPie, label: '统计' },
    { to: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 h-[88px] bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 flex justify-around pt-2 pb-8 z-30">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-colors ${isActive
              ? 'text-primary'
              : 'text-text-secondary hover:text-text-main dark:hover:text-white'
            }`
          }
        >
          <Icon strokeWidth={2} className="w-6 h-6" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;