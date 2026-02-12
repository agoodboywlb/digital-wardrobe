import { BaseService } from '@/lib/baseService';

import type { Database } from '@/types/database';
import type { Category, ItemStatus, ClothingItem } from '@/types/index';

type ItemDB = Database['public']['Tables']['items']['Row'];
type NewItemDB = Database['public']['Tables']['items']['Insert'];
type ItemUpdateDB = Database['public']['Tables']['items']['Update'];

// Helper to map DB row to Frontend Item
const mapToClothingItem = (row: ItemDB): ClothingItem => ({
    id: row.id,
    name: row.name,
    category: row.category as Category,
    subCategory: row.sub_category || undefined,
    imageUrl: row.image_url || '',
    brand: row.brand || undefined,
    size: row.size || undefined,
    material: row.material || undefined,
    purchaseDate: row.purchase_date || undefined,
    lastWorn: row.last_worn || undefined,
    status: row.status as ItemStatus,
    tags: row.tags || [],
    price: row.price || undefined,
    cpw: row.cpw || undefined,
    wearCount: row.wear_count || 0,
    season: row.sub_category || undefined,
});

export class WardrobeService extends BaseService {
    /**
     * Fetch all clothing items sorted by created date descending
     * Only returns items belonging to the current user
     */
    async fetchItems(): Promise<ClothingItem[]> {
        const userId = await this.getCurrentUserId();
        const { data, error } = await this.client
            .from('items')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            this.handleError(error, 'WardrobeService.fetchItems');
        }

        return (data || []).map(mapToClothingItem);
    }

    /**
     * Fetch a single item by ID
     * Only returns the item if it belongs to the current user
     */
    async fetchItem(id: string): Promise<ClothingItem | null> {
        const userId = await this.getCurrentUserId();
        const { data, error } = await this.client
            .from('items')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Not found
                return null;
            }
            this.handleError(error, 'WardrobeService.fetchItem');
        }

        if (!data) { return null; }

        return mapToClothingItem(data);
    }

    /**
     * Add a new clothing item
     * Automatically assigns the item to the current user
     */
    async addItem(item: Omit<ClothingItem, 'id'>): Promise<ClothingItem> {
        const userId = await this.getCurrentUserId();
        const dbItem: NewItemDB = {
            user_id: userId,
            name: item.name,
            category: item.category as Database['public']['Enums']['category'],
            sub_category: (item.season || item.subCategory) ?? null,
            image_url: item.imageUrl ?? null,
            brand: item.brand || null,
            size: item.size || null,
            material: item.material || null,
            purchase_date: item.purchaseDate || null,
            last_worn: item.lastWorn || null,
            status: item.status as Database['public']['Enums']['item_status'],
            tags: item.tags || null,
            price: item.price ?? null,
            cpw: item.cpw ?? null,
            wear_count: item.wearCount ?? 0,
        };

        const { data, error } = await this.client
            .from('items')
            .insert(dbItem)
            .select()
            .single();

        if (error) {
            this.handleError(error, 'WardrobeService.addItem');
        }

        if (!data) { throw new Error('Failed to create item'); }

        return mapToClothingItem(data);
    }

    /**
     * Update an existing clothing item
     * Only updates the item if it belongs to the current user
     */
    async updateItem(id: string, updates: Partial<ClothingItem>): Promise<ClothingItem> {
        const userId = await this.getCurrentUserId();
        const dbUpdates: ItemUpdateDB = {};

        if (updates.name !== undefined) { dbUpdates.name = updates.name; }
        if (updates.category !== undefined) { dbUpdates.category = updates.category as Database['public']['Enums']['category']; }
        if (updates.subCategory !== undefined) { dbUpdates.sub_category = updates.subCategory ?? null; }
        if (updates.imageUrl !== undefined) { dbUpdates.image_url = updates.imageUrl ?? null; }
        if (updates.brand !== undefined) { dbUpdates.brand = updates.brand ?? null; }
        if (updates.size !== undefined) { dbUpdates.size = updates.size ?? null; }
        if (updates.material !== undefined) { dbUpdates.material = updates.material ?? null; }
        if (updates.purchaseDate !== undefined) { dbUpdates.purchase_date = updates.purchaseDate ?? null; }
        if (updates.lastWorn !== undefined) { dbUpdates.last_worn = updates.lastWorn ?? null; }
        if (updates.status !== undefined) { dbUpdates.status = updates.status as Database['public']['Enums']['item_status']; }
        if (updates.tags !== undefined) { dbUpdates.tags = updates.tags ?? null; }
        if (updates.price !== undefined) { dbUpdates.price = updates.price ?? null; }
        if (updates.cpw !== undefined) { dbUpdates.cpw = updates.cpw ?? null; }
        if (updates.wearCount !== undefined) { dbUpdates.wear_count = updates.wearCount ?? 0; }
        if (updates.season !== undefined) { dbUpdates.sub_category = updates.season ?? null; }
        // updated_at trigger usually handles timestamp, but explicit update is fine too if DB supports

        const { data, error } = await this.client
            .from('items')
            .update(dbUpdates)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            this.handleError(error, 'WardrobeService.updateItem');
        }

        if (!data) { throw new Error('Failed to update item'); }

        return mapToClothingItem(data);
    }

    /**
     * Delete an item
     * Only deletes the item if it belongs to the current user
     */
    async deleteItem(id: string): Promise<void> {
        const userId = await this.getCurrentUserId();
        const { error } = await this.client
            .from('items')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            this.handleError(error, 'WardrobeService.deleteItem');
        }
    }

    /**
     * Upload an image to storage
     */
    async uploadImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await this.client.storage
            .from('wardrobe_images')
            .upload(filePath, file);

        if (error) {
            this.handleError(error, 'WardrobeService.uploadImage');
        }

        const {
            data: { publicUrl },
        } = this.client.storage.from('wardrobe_images').getPublicUrl(filePath);

        return publicUrl;
    }

    /**
     * Get basic statistics
     */
    async getStats() {
        // Re-use fetchItems() but this is inefficient if data grows large.
        // For now, it matches previous logic.
        // TODO: Use RPC or aggregate queries for better performance.
        const items = await this.fetchItems();

        const totalItems = items.length;
        const totalValue = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
        const avgPrice = totalItems > 0 ? totalValue / totalItems : 0;

        // Category breakdown
        const categoryCounts: Record<string, number> = {};
        items.forEach((item) => {
            const cat = item.category;
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({
            name,
            value: Math.round((count / totalItems) * 100),
            count,
        }));

        // Items sorted by wear count
        const sortedByWear = [...items].sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0));
        const mostWorn = sortedByWear.slice(0, 3);
        const leastWorn = [...sortedByWear].reverse().slice(0, 3);

        return {
            totalItems,
            totalValue,
            avgPrice,
            categoryData,
            mostWorn,
            leastWorn,
            // Mocking spending trend for now
            spendingTrend: [
                { name: '3月', amount: 400 },
                { name: '4月', amount: 250 },
                { name: '5月', amount: 600 },
                { name: '6月', amount: 1240 },
                { name: '7月', amount: 300 },
                { name: '8月', amount: 150 },
            ],
        };
    }
}

// Export singleton instance
export const wardrobeService = new WardrobeService();
