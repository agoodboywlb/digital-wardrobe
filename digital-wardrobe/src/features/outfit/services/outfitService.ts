import { BaseService } from '@/lib/baseService';

import type { Database } from '../../../types/database';
import type { Outfit, ClothingItem } from '@/types/index';

type OutfitInsert = Database['public']['Tables']['outfits']['Insert'];
type OutfitUpdate = Database['public']['Tables']['outfits']['Update'];
type ItemDB = Database['public']['Tables']['items']['Row'];

interface OutfitItemRow {
    item: ItemDB | null;
}

type OutfitRow = Database['public']['Tables']['outfits']['Row'] & {
    outfit_items?: OutfitItemRow[];
    items?: OutfitItemRow[];
};

const mapToOutfit = (row: OutfitRow): Outfit => {
    const rawItems = row.outfit_items || row.items || [];
    const items: ClothingItem[] = rawItems
        .filter((oi): oi is { item: ItemDB } => !!oi.item)
        .map((oi) => ({
            id: oi.item.id,
            name: oi.item.name,
            category: oi.item.category as unknown as ClothingItem['category'],
            subCategory: oi.item.sub_category || undefined,
            imageUrl: oi.item.image_url || '',
            brand: oi.item.brand || undefined,
            size: oi.item.size || undefined,
            material: oi.item.material || undefined,
            status: oi.item.status as unknown as ClothingItem['status'],
            tags: oi.item.tags || [],
            price: oi.item.price || undefined,
            cpw: oi.item.cpw || undefined,
            wearCount: oi.item.wear_count || 0
        }));

    return {
        id: row.id,
        title: row.title,
        date: row.date || undefined,
        time: row.time || undefined,
        occasion: row.occasion || '',
        season: row.season as unknown as Outfit['season'],
        status: row.status as 'planned' | 'completed',
        items
    };
};

export class OutfitService extends BaseService {
    async fetchOutfits(): Promise<Outfit[]> {
        const userId = await this.getCurrentUserId();
        const { data, error } = await this.client
            .from('outfits')
            .select(`
                *,
                outfit_items (
                    item:items (*)
                )
            `)
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching outfits:', error);
            return [];
        }

        return (data as unknown as OutfitRow[] || []).map(mapToOutfit);
    }

    async createOutfit(outfit: Omit<Outfit, 'id' | 'items'> & { itemIds: string[] }) {
        const userId = await this.getCurrentUserId();
        const insertData: OutfitInsert = {
            user_id: userId,
            title: outfit.title,
            date: outfit.date || null,
            time: outfit.time || null,
            occasion: outfit.occasion || null,
            season: outfit.season as Database['public']['Enums']['season'],
            status: outfit.status as Database['public']['Enums']['outfit_status']
        };

        const { data: newOutfit, error: outfitError } = await this.client
            .from('outfits')
            .insert(insertData)
            .select()
            .single();

        if (outfitError || !newOutfit) {
            this.handleError(outfitError || new Error('Failed to create outfit'), 'OutfitService.createOutfit');
        }

        const outfitItems = outfit.itemIds.map(itemId => ({
            user_id: userId,
            outfit_id: (newOutfit as { id: string }).id,
            item_id: itemId
        }));

        const { error: itemsError } = await this.client
            .from('outfit_items')
            .insert(outfitItems);

        if (itemsError) {
            this.handleError(itemsError, 'OutfitService.createOutfitItems');
        }

        return newOutfit;
    }

    async fetchOutfit(id: string): Promise<Outfit | null> {
        const userId = await this.getCurrentUserId();
        const { data, error } = await this.client
            .from('outfits')
            .select(`
                *,
                outfit_items (
                    item:items (*)
                )
            `)
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            console.error('Error fetching outfit:', error);
            return null;
        }

        return mapToOutfit(data as unknown as OutfitRow);
    }

    async updateOutfit(id: string, outfit: Partial<Omit<Outfit, 'id' | 'items'>> & { itemIds?: string[] }) {
        const userId = await this.getCurrentUserId();
        const updateData: OutfitUpdate = {
            title: outfit.title,
            date: outfit.date,
            time: outfit.time,
            occasion: outfit.occasion,
            season: outfit.season as Database['public']['Enums']['season'],
            status: outfit.status as Database['public']['Enums']['outfit_status']
        };

        const { error: outfitError } = await this.client
            .from('outfits')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId);

        if (outfitError) {
            this.handleError(outfitError, 'OutfitService.updateOutfit');
        }

        if (outfit.itemIds) {
            const { error: delError } = await this.client
                .from('outfit_items')
                .delete()
                .eq('outfit_id', id)
                .eq('user_id', userId);

            if (delError) { this.handleError(delError, 'OutfitService.updateOutfitItems.delete'); }

            const outfitItems = outfit.itemIds.map(itemId => ({
                user_id: userId,
                outfit_id: id,
                item_id: itemId
            }));

            const { error: insError } = await this.client
                .from('outfit_items')
                .insert(outfitItems);

            if (insError) { this.handleError(insError, 'OutfitService.updateOutfitItems.insert'); }
        }

        return true;
    }

    async deleteOutfit(id: string) {
        const userId = await this.getCurrentUserId();
        const { error } = await this.client
            .from('outfits')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            this.handleError(error, 'OutfitService.deleteOutfit');
        }
        return true;
    }

    async fetchRelatedOutfits(itemId: string): Promise<Outfit[]> {
        const userId = await this.getCurrentUserId();
        const { data, error } = await this.client
            .from('outfits')
            .select(`
                *,
                outfit_items!inner(item_id),
                items:outfit_items(
                    item:items(*)
                )
            `)
            .eq('user_id', userId)
            .eq('outfit_items.item_id', itemId)
            .order('date', { ascending: false });

        if (error) {
            console.error("Error fetching related outfits", error);
            return [];
        }

        return (data as unknown as OutfitRow[] || []).map(mapToOutfit);
    }
}

export const outfitService = new OutfitService();
