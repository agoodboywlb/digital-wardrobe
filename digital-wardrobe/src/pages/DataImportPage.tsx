import { ChevronLeft, ShoppingBag, Link as LinkIcon, RefreshCw, CircleCheck, Loader2, CircleAlert, Package, CheckSquare, Archive } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// import { MOCK_IMPORTS } from '@/utils/constants'; // REMOVED
import { importService } from '@/features/import/services/importService';

import type React from 'react';

interface ImportRecord {
  id: string;
  title: string;
  source: string;
  orderId: string | null;
  date: string;
  price: number;
  status: 'parsing' | 'parsed' | 'review_needed' | 'imported';
  imageUrl: string;
}

const DataImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadImports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await importService.fetchImports();
      setImports(data as ImportRecord[]);
    } catch (error) {
      console.error("Failed to load imports", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadImports();
  }, [loadImports]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await importService.syncImports();
      // In a real app, we might poll or wait for specific updates
      // Here we just reload items after a delay to simulate
      setTimeout(() => {
        setSyncing(false);
        void loadImports();
      }, 1500);
    } catch (error) {
      console.error("Sync failed", error);
      setSyncing(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white dark:bg-surface-dark flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between">
          <button
            type="button"
            onClick={() => { void navigate(-1); }}
            className="text-text-main dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight">数据导入</h2>
          <div className="size-10"></div>
        </div>

        {/* Status Card */}
        <div className="px-4 pb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-[#ff5000]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-text-main dark:text-white text-sm font-bold">淘宝已连接</span>
                  <LinkIcon className="text-primary w-4 h-4" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">上次同步: 刚刚</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { void handleSync(); }}
              disabled={syncing}
              className="flex items-center justify-center gap-1 h-8 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-70">
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? '同步中' : '同步'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* List */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="px-4 pt-4 pb-2 flex items-end justify-between">
          <h3 className="text-text-main dark:text-white text-xl font-bold">导入记录</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">今天</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-4">
            {imports.map((item) => (
              <div
                key={item.id}
                className={`group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 flex gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer relative ${item.status === 'parsing' ? 'overflow-hidden' : ''} ${item.status === 'imported' ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                {item.status === 'parsing' && (
                  <div className="absolute bottom-0 left-0 h-0.5 bg-primary/20 w-full">
                    <div className="h-full bg-primary w-2/3 animate-pulse"></div>
                  </div>
                )}

                <div className="relative shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className={`w-full h-full object-cover ${item.status === 'parsing' ? 'opacity-80' : ''}`} />
                  ) : (
                    <CircleAlert className="text-gray-400 w-8 h-8" />
                  )}
                </div>

                <div className="flex flex-col flex-1 justify-between py-0.5">
                  <div>
                    <h4 className="text-sm font-bold text-text-main dark:text-white line-clamp-2 leading-snug">{item.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.date}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`font-mono font-semibold ${item.status === 'review_needed' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-text-main dark:text-white'}`}>
                      ¥{Number(item.price).toFixed(2)}
                    </span>

                    {item.status === 'parsed' && (
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md border border-green-100 dark:border-green-900/30">
                        <CircleCheck className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">已解析</span>
                      </div>
                    )}
                    {item.status === 'parsing' && (
                      <div className="flex items-center gap-1 text-primary bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-900/30">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-xs font-medium">解析中</span>
                      </div>
                    )}
                    {item.status === 'review_needed' && (
                      <div className="flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md border border-amber-100 dark:border-amber-900/30">
                        <CircleAlert className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">需人工确认</span>
                      </div>
                    )}
                    {item.status === 'imported' && (
                      <div className="flex items-center gap-1 text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                        <Package className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">已导入</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="h-6"></div>
      </main>

      {/* Footer Actions */}
      <div className="absolute bottom-0 w-full bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{imports.length} 件商品等待处理</span>
          <button type="button" className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5">
            <span>全选</span>
            <CheckSquare className="w-4 h-4" />
          </button>
        </div>
        <button type="button" className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-base h-12 rounded-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
          <Archive className="w-5 h-5" />
          <span>确认并入库</span>
        </button>
        <div className="h-4 w-full"></div>
      </div>
    </div>
  );
};

export default DataImportPage;