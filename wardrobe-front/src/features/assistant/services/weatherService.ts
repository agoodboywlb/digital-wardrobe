import { BaseService } from '@/lib/baseService';
import { generateQWeatherToken } from '@/utils/qweatherJwt';

import type { WeatherData } from '../types';

const CACHE_KEY = 'wardrobe_weather_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const API_HOST = import.meta.env['VITE_QWEATHER_API_HOST'] || 'devapi.qweather.com'; // 支持自定义 Host

export class WeatherService extends BaseService {
    /**
     * 获取城市地理编码
     * @param city 城市名称
     */
    private async getGeoCode(city: string) {
        // 生成 JWT Token
        const token = await generateQWeatherToken();

        // 始终使用配置的 API_HOST，不再强制切换到公网 geoapi
        // 对于私有部署/订阅，GeoAPI 通常也是同一个域名
        let host = API_HOST;
        // 注意: 私有部署/订阅的 GeoAPI 路径通常带有 /geo 前缀
        let url = `https://${host}/geo/v2/city/lookup?location=${encodeURIComponent(city)}`;

        try {
            let response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // 如果自定义 Host 失败,且不是公网 geoapi,则降级
            if (!response.ok && host !== 'geoapi.qweather.com') {
                console.warn(`Custom GeoApi failed, trying Public GeoApi...`);
                host = 'geoapi.qweather.com';
                url = `https://${host}/v2/city/lookup?location=${encodeURIComponent(city)}`;
                response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }

            // 检查 HTTP 状态码
            console.log(`GeoAPI HTTP Status (${host}):`, response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`GeoAPI HTTP Error:`, {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText.substring(0, 200),
                    city,
                });

                if (response.status === 401 || response.status === 403) {
                    throw new Error(
                        `和风天气 API 认证失败 (${response.status})。\n` +
                        '请检查:\n' +
                        '1. KEY_ID 和 PROJECT_ID 是否正确\n' +
                        '2. 私钥是否与 KEY_ID 匹配\n' +
                        '3. 项目是否有 API 访问权限'
                    );
                }

                throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // 记录 API 响应用于调试
            console.log(`GeoAPI Response (${host}):`, {
                code: data.code,
                locationCount: data.location?.length || 0,
                city,
            });

            if (data.code === '200' && data.location?.[0]) {
                return data.location[0];
            }

            // API 返回了错误码
            if (data.code !== '200') {
                console.warn(`GeoAPI returned error code: ${data.code} for city: ${city}`);
            }
        } catch (e) {
            console.warn('GeoLookup failed for host:', host, e);
            // 如果在 catch 中,且还没试过公网,再试一次
            if (host !== 'geoapi.qweather.com') {
                const output = await this.fetchPublicGeo(city, token);
                if (output) {return output;}
            }
        }

        // 所有尝试都失败了,提供更有用的错误信息
        throw new Error(
            `无法找到城市"${city}"。请尝试:\n` +
            '1. 使用完整的城市名称(如"北京市"、"上海市")\n' +
            '2. 使用拼音(如"beijing"、"shanghai")\n' +
            '3. 检查城市名称拼写是否正确'
        );
    }

    /**
     * 使用公网 GeoAPI 查询城市
     */
    private async fetchPublicGeo(city: string, token: string) {
        try {
            const url = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(city)}`;
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();
            return (data.code === '200' && data.location?.[0]) ? data.location[0] : null;
        } catch {
            return null;
        }
    }

    private pendingRequest: Promise<WeatherData> | null = null;
    private pendingCity: string | null = null;

    /**
     * 获取天气信息
     * @param city 城市名称
     */
    async fetchWeather(city: string): Promise<WeatherData> {
        // 1. 检查缓存
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp, city: cachedCity } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION && city === cachedCity) {
                console.log('Using cached weather data');
                return data;
            }
        }

        // 2. 检查是否有正在进行的请求 (请求去重)
        if (this.pendingRequest && this.pendingCity === city) {
            console.log('Returning pending weather request for', city);
            return this.pendingRequest;
        }

        // 3. 发起新请求
        this.pendingCity = city;
        this.pendingRequest = (async () => {
            try {
                // 生成 JWT Token
                const token = await generateQWeatherToken();

                // 获取城市地理编码
                const location = await this.getGeoCode(city);

                // 使用配置的 Host (默认为 devapi.qweather.com)
                let weatherUrl = `https://${API_HOST}/v7/weather/now?location=${location.id}`;

                let response = await fetch(weatherUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // 如果自定义 Host 不工作且是默认值,尝试 fallback 逻辑
                if (!response.ok && API_HOST === 'devapi.qweather.com') {
                    console.warn(`DevApi failed, trying Standard Api...`);
                    weatherUrl = `https://api.qweather.com/v7/weather/now?location=${location.id}`;
                    response = await fetch(weatherUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                }

                const data = await response.json();

                if (data.code === '200') {
                    const weather: WeatherData = {
                        temp: parseInt(data.now.temp),
                        condition: data.now.text,
                        city: location.name, // 使用最具体的地点名
                        updateTime: data.updateTime,
                    };

                    // 写入缓存
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data: weather,
                        timestamp: Date.now(),
                        city: city // 确保存储原始查询词
                    }));

                    return weather;
                }

                throw new Error(`Weather API Error: ${data.code}`);
            } catch (error) {
                console.error('WeatherService error:', error);

                // 如果出错,尝试从缓存恢复旧数据(即使过期)
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    console.warn('Weather fetch failed, using stale cache');
                    return JSON.parse(cached).data;
                }

                throw new Error(`Failed to fetch weather: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        })();

        // 等待请求完成,然后清理 pending 状态
        try {
            return await this.pendingRequest;
        } finally {
            this.pendingRequest = null;
            this.pendingCity = null;
        }
    }
}

export const weatherService = new WeatherService();
