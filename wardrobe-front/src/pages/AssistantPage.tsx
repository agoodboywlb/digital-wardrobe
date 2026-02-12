import { useState, useEffect } from 'react';

import OptimizedImage from '../components/common/OptimizedImage';
import { assistantService } from '../features/assistant/services/assistantService';

import type { RecommendationResult } from '../features/assistant/types';
import type React from 'react';

const AssistantPage: React.FC = () => {
    // 优先从缓存读取城市，不再默认硬编码为"北京"
    const [city, setCity] = useState(() => localStorage.getItem('wardrobe_city') || '');
    const [isEditingCity, setIsEditingCity] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    const fetchRecommendation = async (searchCity: string) => {
        if (!searchCity) {return;}

        setLoading(true);
        setError(null);
        try {
            const res = await assistantService.getSmartRecommendation(searchCity);
            setRecommendation(res);

            // 如果是首次定位（searchCity包含坐标）或缓存为空，更新本地存储和状态
            // 确保下次进入时能直接使用城市名
            if (!city || searchCity.includes(',')) {
                const resolvedCity = res.weather.city;
                setCity(resolvedCity);
                localStorage.setItem('wardrobe_city', resolvedCity);
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : '获取推荐失败，请稍后重试');
            setRecommendation(null); // 出错时清空旧数据

            // 如果是自动定位失败，回退到默认城市
            if (searchCity.includes(',')) {
                setCity('北京');
                fetchRecommendation('北京');
            }
        } finally {
            setLoading(false);
            setIsLocating(false);
        }
    };

    useEffect(() => {
        // 初始化逻辑
        if (city) {
            // 1. 如果有缓存城市，直接使用
            fetchRecommendation(city);
        } else {
            // 2. 如果没有缓存，尝试地理定位
            setIsLocating(true);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // 使用坐标查询: "lon,lat"
                        const coords = `${position.coords.longitude.toFixed(2)},${position.coords.latitude.toFixed(2)}`;
                        fetchRecommendation(coords);
                    },
                    (geoError) => {
                        console.warn('Geolocation failed:', geoError);
                        // 3. 定位失败，回退到默认城市
                        const defaultCity = '北京';
                        setCity(defaultCity);
                        fetchRecommendation(defaultCity);
                    },
                    { timeout: 5000 }
                );
            } else {
                // 不支持定位，直接使用默认
                const defaultCity = '北京';
                setCity(defaultCity);
                fetchRecommendation(defaultCity);
            }
        }
    }, []); // 仅组件挂载时执行

    const handleCitySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!city.trim()) {return;}

        localStorage.setItem('wardrobe_city', city);
        setIsEditingCity(false);
        fetchRecommendation(city);
    };

    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">智能助手</h1>

            {/* Weather Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        {isEditingCity ? (
                            <form onSubmit={handleCitySubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
                                    autoFocus
                                    placeholder="输入城市名..."
                                />
                                <button type="submit" className="text-primary text-sm font-medium">确认</button>
                            </form>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold dark:text-white">
                                    {isLocating ? '定位中...' : (recommendation?.weather.city || city)}
                                </span>
                                <button
                                    onClick={() => setIsEditingCity(true)}
                                    className="text-gray-400 text-xs text-primary hover:text-primary-dark"
                                    disabled={loading || isLocating}
                                >
                                    切换城市
                                </button>
                            </div>
                        )}
                        <p className="text-gray-500 text-sm mt-1">
                            {loading || isLocating ? '获取天气信息...' : (
                                recommendation ? `${recommendation.weather.condition} ${recommendation.weather.temp}°C` : '--'
                            )}
                        </p>
                    </div>
                    <div className="text-4xl">
                        {recommendation?.weather.temp && recommendation.weather.temp > 25 ? '☀️' : (recommendation ? '☁️' : '⏳')}
                    </div>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic border-l-4 border-primary pl-3 min-h-[3em]">
                    {error ? (
                        <span className="text-red-500 not-italic">{error}</span>
                    ) : (
                        recommendation?.reason || (isLocating ? '正在获取您的位置...' : '正在分析天气与衣橱...')
                    )}
                </div>
            </div>

            {/* Recommendation Section */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold dark:text-white">为您生成的新搭配</h2>
                    <button
                        onClick={() => fetchRecommendation(city)}
                        disabled={loading || isLocating}
                        className="text-primary text-sm font-medium disabled:opacity-50"
                    >
                        {loading ? '生成中...' : '换一批'}
                    </button>
                </div>

                {recommendation ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {recommendation.items.map(item => (
                                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                                    <div className="aspect-square">
                                        <OptimizedImage src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-medium dark:text-white truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500 uppercase">{item.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p>{error ? '出错了，请尝试刷新' : '正在为这一天做准备...'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssistantPage;
