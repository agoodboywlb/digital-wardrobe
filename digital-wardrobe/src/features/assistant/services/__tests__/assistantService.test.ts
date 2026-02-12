import { describe, it, expect, vi, beforeEach } from 'vitest';
import { assistantService } from '../assistantService';
import { wardrobeService } from '@/features/wardrobe/services/wardrobeService';
import { weatherService } from '../weatherService';
import type { ClothingItem } from '@/types/index';
import { Category, ItemStatus } from '@/types/index';

// Mock dependencies
vi.mock('@/features/wardrobe/services/wardrobeService');
vi.mock('../weatherService');

// Mock fetch globally
global.fetch = vi.fn();

describe('AssistantService AI Integration', () => {
    const mockWeather = {
        temp: 20,
        condition: '晴',
        city: '北京',
        updateTime: '2026-02-11T12:00:00Z',
    };

    const mockItems: ClothingItem[] = [
        {
            id: 'item-1',
            name: '白色T恤',
            category: Category.Tops,
            subCategory: 'T-shirt',
            imageUrl: 'https://example.com/tshirt.jpg',
            status: ItemStatus.InWardrobe,
            tags: ['casual', 'summer'],
            brand: 'Uniqlo',
        },
        {
            id: 'item-2',
            name: '牛仔裤',
            category: Category.Bottoms,
            subCategory: 'Jeans',
            imageUrl: 'https://example.com/jeans.jpg',
            status: ItemStatus.InWardrobe,
            tags: ['casual'],
            brand: 'Levi\'s',
        },
        {
            id: 'item-3',
            name: '运动鞋',
            category: Category.Footwear,
            imageUrl: 'https://example.com/shoes.jpg',
            status: ItemStatus.ToWash,
            tags: ['sport'],
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock weatherService
        vi.mocked(weatherService.fetchWeather).mockResolvedValue(mockWeather);

        // Mock wardrobeService
        vi.mocked(wardrobeService.fetchItems).mockResolvedValue(mockItems);
    });

    it('should call AI service with correct payload format', async () => {
        const mockAIResponse = {
            title: '清爽休闲搭配',
            description: '适合今日天气的轻松穿搭',
            item_ids: ['item-1', 'item-2'],
            style_category: 'Casual',
        };

        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockAIResponse,
        });

        await assistantService.getSmartRecommendation('北京');

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8000/generate-outfit',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: expect.stringContaining('item-1'),
            })
        );

        // Verify request body structure
        const callArgs = (global.fetch as any).mock.calls[0];
        const requestBody = JSON.parse(callArgs[1].body);

        expect(requestBody).toHaveProperty('items');
        expect(requestBody).toHaveProperty('weather');
        expect(requestBody).toHaveProperty('vibe');
        expect(requestBody.items).toHaveLength(2); // Only in_wardrobe items
        expect(requestBody.weather.temp).toBe(20);
        expect(requestBody.weather.city).toBe('北京');
    });

    it('should transform AI response to frontend format', async () => {
        const mockAIResponse = {
            title: '清爽休闲搭配',
            description: '适合今日天气的轻松穿搭',
            item_ids: ['item-1', 'item-2'],
            style_category: 'Casual',
        };

        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockAIResponse,
        });

        const result = await assistantService.getSmartRecommendation('北京');

        expect(result).toMatchObject({
            items: expect.arrayContaining([
                expect.objectContaining({ id: 'item-1', name: '白色T恤' }),
                expect.objectContaining({ id: 'item-2', name: '牛仔裤' }),
            ]),
            reason: '适合今日天气的轻松穿搭',
            weather: mockWeather,
            title: '清爽休闲搭配',
            style_category: 'Casual',
        });
    });

    it('should handle AI service network errors gracefully', async () => {
        (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

        const result = await assistantService.getSmartRecommendation('北京');

        // Should fallback to rule-based generator
        expect(result).toHaveProperty('items');
        expect(result).toHaveProperty('reason');
        expect(result).toHaveProperty('weather');
        expect(result.reason).toContain('北京'); // Rule-based generator includes city
    });

    it('should handle AI service HTTP errors (4xx, 5xx)', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
        });

        const result = await assistantService.getSmartRecommendation('北京');

        // Should fallback to rule-based generator
        expect(result).toHaveProperty('items');
        expect(result).toHaveProperty('reason');
        expect(result).toHaveProperty('weather');
    });

    it('should filter only in_wardrobe items for AI service', async () => {
        const mockAIResponse = {
            title: '测试搭配',
            description: '测试描述',
            item_ids: ['item-1'],
            style_category: 'Test',
        };

        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockAIResponse,
        });

        await assistantService.getSmartRecommendation('北京');

        const callArgs = (global.fetch as any).mock.calls[0];
        const requestBody = JSON.parse(callArgs[1].body);

        // Should only include item-1 and item-2 (in_wardrobe), not item-3 (to_wash)
        expect(requestBody.items).toHaveLength(2);
        expect(requestBody.items.every((item: any) =>
            ['item-1', 'item-2'].includes(item.id)
        )).toBe(true);
    });

    it('should handle empty AI response item_ids', async () => {
        const mockAIResponse = {
            title: '无可用搭配',
            description: '当前衣橱中没有合适的单品',
            item_ids: [],
            style_category: 'None',
        };

        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockAIResponse,
        });

        const result = await assistantService.getSmartRecommendation('北京');

        expect(result.items).toHaveLength(0);
        expect(result.title).toBe('无可用搭配');
    });
});
