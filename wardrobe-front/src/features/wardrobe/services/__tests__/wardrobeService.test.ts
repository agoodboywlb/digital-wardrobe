
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { supabase } from '@/lib/supabase';

import { wardrobeService } from '../wardrobeService';

// Mock supabase client
vi.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            getUser: vi.fn(),
        },
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
    },
}));

describe('WardrobeService Data Isolation', () => {
    const mockUserId = 'test-user-123';

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock for successful user retrieval
        (supabase.auth.getUser as any).mockResolvedValue({
            data: { user: { id: mockUserId } },
            error: null,
        });
    });

    it('fetchItems should filter by current user_id', async () => {
        const mockData = [{ id: '1', name: 'Shirt', user_id: mockUserId }];
        (supabase.from as any).mockReturnValue({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockImplementation(() => Promise.resolve({ data: mockData, error: null })),
        });

        const items = await wardrobeService.fetchItems();

        expect(supabase.from).toHaveBeenCalledWith('items');
        // The chain should include eq('user_id', mockUserId)
        const fromResult = (supabase.from as any).mock.results[0].value;
        expect(fromResult.eq).toHaveBeenCalledWith('user_id', mockUserId);
        expect(items).toHaveLength(1);
        expect(items[0]!.name).toBe('Shirt');
    });

    it('addItem should inject current user_id', async () => {
        const newItem = { name: 'New Shirt', category: 'tops' as const, status: 'in_wardrobe' as const };
        const mockResponse = { id: '2', ...newItem, user_id: mockUserId };

        (supabase.from as any).mockReturnValue({
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
        });

        await wardrobeService.addItem(newItem as any);

        expect(supabase.from).toHaveBeenCalledWith('items');
        const insertCall = (supabase.from as any).mock.results[0].value.insert;
        expect(insertCall).toHaveBeenCalledWith(expect.objectContaining({
            user_id: mockUserId,
            name: 'New Shirt'
        }));
    });

    it('should throw error if user is not authenticated', async () => {
        (supabase.auth.getUser as any).mockResolvedValue({
            data: { user: null },
            error: null,
        });

        await expect(wardrobeService.fetchItems()).rejects.toThrow('用户未登录或会话已过期');
    });

    it('fetchItem should include associated images', async () => {
        const mockItem = {
            id: '1',
            name: 'Shirt',
            user_id: mockUserId,
            item_images: [
                { id: 'img-1', item_id: '1', image_url: 'url-1', is_primary: true, sort_order: 0, created_at: new Date().toISOString() }
            ]
        };

        (supabase.from as any).mockReturnValue({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockItem, error: null }),
        });

        const item = await wardrobeService.fetchItem('1');

        expect(supabase.from).toHaveBeenCalledWith('items');
        const fromResult = (supabase.from as any).mock.results[0].value;
        expect(fromResult.select).toHaveBeenCalledWith('*, item_images(*)');
        expect(item?.images).toHaveLength(1);
        expect(item?.images?.[0]?.imageUrl).toBe('url-1');
    });
});
