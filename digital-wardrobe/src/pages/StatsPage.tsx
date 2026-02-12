import { ChevronLeft, Share2, Wallet, TrendingUp, ChartBar, Shirt, Archive, ChartPie, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer, Cell, PieChart as RePie, Pie } from 'recharts';

import { wardrobeService } from '@/features/wardrobe/services/wardrobeService';
import { getCategoryLabel, getCategoryColor } from '@/utils/formatters';

import type { WardrobeStats } from '@/types/index';
import type React from 'react';
import OptimizedImage from '@/components/common/OptimizedImage';

const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<WardrobeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await wardrobeService.getStats();
        setStats(data);
      } catch (e) {
        console.error("Failed stats", e);
      } finally {
        setLoading(false);
      }
    };
    void loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!stats) { return null; }

  return (
    <div className="pb-32 bg-background-light dark:bg-background-dark min-h-screen">
      {/* Header */}
      <div className="flex items-center bg-white dark:bg-surface-dark p-4 pb-2 justify-between sticky top-0 z-30 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => {
            void navigate(-1);
          }}
          className="text-text-main dark:text-white flex size-12 shrink-0 items-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center">数据中心</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex items-center justify-center h-12 bg-transparent text-text-main dark:text-white">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-4">
        {/* Asset Overview */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-main dark:text-white text-base font-bold flex items-center gap-2">
              <Wallet className="text-primary w-5 h-5" />
              资产概览
            </h3>
            <span className="text-xs text-text-secondary bg-gray-50 dark:bg-background-dark px-2 py-1 rounded-full">实时</span>
          </div>
          <div className="grid grid-cols-3 gap-2 divide-x divide-gray-100 dark:divide-gray-800">
            <div className="flex flex-col items-center px-1">
              <span className="text-xs text-text-secondary mb-1">单品总数</span>
              <span className="text-3xl font-bold text-text-main dark:text-white">{stats.totalItems}</span>
              {/* <span className="text-[10px] text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-0.5" />+3
              </span> */}
            </div>
            <div className="flex flex-col items-center px-1">
              <span className="text-xs text-text-secondary mb-1">估值 (¥)</span>
              <span className="text-3xl font-bold text-text-main dark:text-white">{stats.totalValue > 10000 ? `${(stats.totalValue / 10000).toFixed(1)}w` : stats.totalValue}</span>
            </div>
            <div className="flex flex-col items-center px-1">
              <span className="text-xs text-text-secondary mb-1">均价</span>
              <span className="text-3xl font-bold text-text-main dark:text-white">{Math.round(stats.avgPrice)}</span>
            </div>
          </div>
        </section>

        {/* Spending Analysis */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-text-main dark:text-white text-base font-bold flex items-center gap-2">
              <ChartBar className="text-primary w-5 h-5" />
              消费趋势 (Mock)
            </h3>
            <span className="text-xs text-text-secondary">近6个月</span>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.spendingTrend}>
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {stats.spendingTrend.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.amount > 1000 ? '#FAC638' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between px-2 mt-2">
            {stats.spendingTrend.map((d) => (
              <span key={d.name} className={`text-[10px] ${d.amount > 1000 ? 'font-bold text-black dark:text-white' : 'text-gray-400'}`}>{d.name}</span>
            ))}
          </div>
        </section>

        {/* CPW Ranking */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-main dark:text-white text-base font-bold flex items-center gap-2 px-1">
            <TrendingUp className="text-primary w-5 h-5" />
            穿衣效率 (每穿成本 CPW)
          </h3>

          {/* Best Value */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="px-5 py-3 bg-green-50 dark:bg-green-900/10 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <span className="text-sm font-bold text-green-800 dark:text-green-400">🔥 最佳单品 (高频使用)</span>
              <span className="text-[10px] text-green-700 dark:text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Top 3</span>
            </div>
            <div className="p-2">
              {stats.mostWorn.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-background-dark rounded-xl transition-colors">
                  <div className="text-xs font-bold text-text-secondary w-4">{idx + 1}</div>
                  <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-background-dark flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? <OptimizedImage src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <Shirt className="text-gray-400 w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-text-main dark:text-white truncate">{item.name}</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">已穿 {item.wearCount} 次</p>
                  </div>
                  {/* <div className="text-right">
                      <p className="text-base font-bold text-text-main dark:text-white">¥ 1.2</p>
                      <p className="text-[10px] text-text-secondary">/次</p>
                    </div> */}
                </div>
              ))}
            </div>
          </div>

          {/* Low Value */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="px-5 py-3 bg-red-50 dark:bg-red-900/10 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <span className="text-sm font-bold text-red-800 dark:text-red-400">🧊 闲置预警 (低频使用)</span>
              <span className="text-[10px] text-red-700 dark:text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">Top 3</span>
            </div>
            <div className="p-2">
              {stats.leastWorn.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-background-dark rounded-xl transition-colors">
                  <div className="text-xs font-bold text-text-secondary w-4">{idx + 1}</div>
                  <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-background-dark flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? <OptimizedImage src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <Archive className="text-gray-400 w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-text-main dark:text-white truncate">{item.name}</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">已穿 {item.wearCount} 次</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-text-main dark:text-white text-base font-bold flex items-center gap-2">
              <ChartPie className="text-primary w-5 h-5" />
              品类占比
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RePie>
                  <Pie
                    data={stats.categoryData}
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} stroke="none" />
                    ))}
                  </Pie>
                </RePie>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-text-main dark:text-white">100%</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3 w-full">
              {stats.categoryData.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(c.name) }}></span>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-text-main dark:text-white">{getCategoryLabel(c.name)}</span>
                    <span className="text-[10px] text-text-secondary">{c.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatsPage;