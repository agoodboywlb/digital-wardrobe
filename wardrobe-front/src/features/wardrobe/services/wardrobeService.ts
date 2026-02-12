import { BaseService } from '@/lib/baseService';

import type { Database } from '@/types/database';
import type { Category, ItemStatus, ClothingItem } from '@/types/index';

type ItemDB = Database['public']['Tables']['items']['Row'] & {
    item_images?: Database['public']['Tables']['item_images']['Row'][];
};
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
    images: row.item_images?.map(img => ({
        id: img.id,
        itemId: img.item_id,
        imageUrl: img.image_url,
        label: img.label || undefined,
        sortOrder: img.sort_order,
        isPrimary: img.is_primary,
        createdAt: img.created_at
    })).sort((a, b) => a.sortOrder - b.sortOrder)
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
            .select('*, item_images(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            this.handleError(error, 'WardrobeService.fetchItems');
        }

        return (data || []).map((row: any) => mapToClothingItem(row));
    }

    /**
     * Fetch a single item by ID
     * Only returns the item if it belongs to the current user
     */
    async fetchItem(id: string): Promise<ClothingItem | null> {
        const userId = await this.getCurrentUserId();
        const { data, error } = await this.client
            .from('items')
            .select('*, item_images(*)')
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

        return mapToClothingItem(data as any);
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
     * Add a new image for an item
     */
    async addItemImage(itemId: string, imageUrl: string, label?: string): Promise<void> {
        const userId = await this.getCurrentUserId();

        // Check if this is the first image to set it as primary
        const { count } = await this.client
            .from('item_images')
            .select('*', { count: 'exact', head: true })
            .eq('item_id', itemId);

        const isPrimary = count === 0;

        const { error: imgError } = await this.client
            .from('item_images')
            .insert({
                item_id: itemId,
                image_url: imageUrl,
                label: label || null,
                is_primary: isPrimary,
                user_id: userId,
                sort_order: (count || 0)
            });

        if (imgError) {
            this.handleError(imgError, 'WardrobeService.addItemImage');
        }

        // If it's primary, update the main items table
        if (isPrimary) {
            await this.updateItem(itemId, { imageUrl });
        }
    }

    /**
     * Delete an image
     */
    async deleteItemImage(imageId: string, itemId: string): Promise<void> {
        const userId = await this.getCurrentUserId();

        // 1. Check if it was primary before deleting
        const { data: imgData } = await this.client
            .from('item_images')
            .select('is_primary')
            .eq('id', imageId)
            .single();

        const wasPrimary = imgData?.is_primary || false;

        // 2. Delete the image
        const { error } = await this.client
            .from('item_images')
            .delete()
            .eq('id', imageId)
            .eq('user_id', userId);

        if (error) {
            this.handleError(error, 'WardrobeService.deleteItemImage');
        }

        // 3. If primary was deleted, promote another one
        if (wasPrimary) {
            const { data: nextImg } = await this.client
                .from('item_images')
                .select('id, image_url')
                .eq('item_id', itemId)
                .order('sort_order', { ascending: true })
                .limit(1)
                .maybeSingle();

            if (nextImg) {
                await this.setPrimaryImage(nextImg.id, itemId);
            } else {
                // No images left
                await this.updateItem(itemId, { imageUrl: '' });
            }
        }
    }

    /**
     * Set an image as primary
     */
    async setPrimaryImage(imageId: string, itemId: string): Promise<void> {
        const userId = await this.getCurrentUserId();

        // 1. Get the image URL first
        const { data: imgData } = await this.client
            .from('item_images')
            .select('image_url')
            .eq('id', imageId)
            .single();

        if (!imgData) { throw new Error('Image not found'); }

        // 2. Clear other primaries for this item
        await this.client
            .from('item_images')
            .update({ is_primary: false })
            .eq('item_id', itemId)
            .eq('user_id', userId);

        // 3. Set new primary
        await this.client
            .from('item_images')
            .update({ is_primary: true })
            .eq('id', imageId)
            .eq('user_id', userId);

        // 4. Sync to main items table
        await this.updateItem(itemId, { imageUrl: imgData.image_url });
    }

    /**
     * Reorder images
     */
    async reorderImages(imageIds: string[]): Promise<void> {
        const userId = await this.getCurrentUserId();

        // Perform parallel updates for sort order
        const updates = imageIds.map((id, index) =>
            this.client
                .from('item_images')
                .update({ sort_order: index })
                .eq('id', id)
                .eq('user_id', userId)
        );

        const results = await Promise.all(updates);
        const error = results.find(r => r.error);
        if (error) {
            this.handleError(error.error, 'WardrobeService.reorderImages');
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
