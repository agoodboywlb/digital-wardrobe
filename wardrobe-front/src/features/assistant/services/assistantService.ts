import { wardrobeService } from '@/features/wardrobe/services/wardrobeService';
import { BaseService } from '@/lib/baseService';

import { weatherService } from './weatherService';
import { generateRecommendation } from '../utils/generator';

import type {
    RecommendationResult,
    AIServiceRequest,
    AIServiceResponse,
    AIServiceClothingItem
} from '../types';
import type { ClothingItem } from '@/types/index';

export class AssistantService extends BaseService {
    private readonly AI_SERVICE_URL = import.meta.env['VITE_AI_SERVICE_URL'] || 'http://localhost:8000';

    async getSmartRecommendation(city: string): Promise<RecommendationResult> {
        const [weather, items] = await Promise.all([
            weatherService.fetchWeather(city),
            wardrobeService.fetchItems(),
        ]);

        // Filter only items in wardrobe
        const availableItems = items.filter(item => item.status === 'in_wardrobe');

        // Try AI service first, fallback to rule-based generator
        try {
            const result = await this.getAIRecommendation(availableItems, weather);
            console.log('✅ AI 服务调用成功 (Gemini)', { title: result.title, style: result.style_category });
            return result;
        } catch (error) {
            console.warn('AI service failed, falling back to rule-based generator:', error);
            return generateRecommendation(items, weather);
        }
    }

    private async getAIRecommendation(
        items: ClothingItem[],
        weather: { temp: number; condition: string; city: string; updateTime: string }
    ): Promise<RecommendationResult> {
        // Transform frontend items to AI service format
        const aiItems: AIServiceClothingItem[] = items.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            sub_category: item.subCategory,
            color: item.brand, // Using brand as color proxy since color is not in ClothingItem type
            tags: item.tags || [],
        }));

        const requestBody: AIServiceRequest = {
            items: aiItems,
            weather: {
                temp: weather.temp,
                condition: weather.condition,
                city: weather.city,
            },
            vibe: 'casual', // Default vibe, can be made configurable later
        };

        const response = await fetch(`${this.AI_SERVICE_URL}/generate-outfit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`AI service returned ${response.status}: ${response.statusText}`);
        }

        const aiResponse: AIServiceResponse = await response.json();
        console.log('🤖 AI 响应数据:', aiResponse);

        // Transform AI response back to frontend format
        const selectedItems = items.filter(item => {
            const matched = aiResponse.item_ids.includes(item.id);
            if (matched) {console.log(`✅ 匹配到单品: ${item.name} (${item.id})`);}
            return matched;
        });

        if (selectedItems.length === 0) {
            console.warn('⚠️ AI 返回的单品 ID 在本地衣橱中未找到:', aiResponse.item_ids);
        }

        return {
            items: selectedItems,
            reason: aiResponse.description,
            weather,
            title: aiResponse.title,
            style_category: aiResponse.style_category,
        };
    }
}

export const assistantService = new AssistantService();

