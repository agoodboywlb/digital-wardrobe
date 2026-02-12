
import { BaseService } from '@/lib/baseService';

import type { Database } from '@/types/database';

type ImportRecordDB = Database['public']['Tables']['import_records']['Row'];

export class ImportService extends BaseService {
    /**
     * Fetch all import records for the current user
     */
    async fetchImports() {
        const userId = await this.getCurrentUserId();
        const { data, error } = await this.client
            .from('import_records')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            this.handleError(error, 'ImportService.fetchImports');
        }

        // Map to frontend interface (camelCase)
        // frontend interface: id, title, source, orderId, date, price, status, imageUrl
        return (data || []).map((record: ImportRecordDB) => ({
            id: record.id,
            title: record.title,
            source: record.source,
            orderId: record.order_id,
            date: record.date || '', // handle nulls as string
            price: record.price || 0,
            status: record.status,
            imageUrl: record.image_url || ''
        }));
    }

    /**
     * Sync imports from external sources
     */
    async syncImports() {
        // Logic to trigger a real sync (e.g., call Edge Function)
        // For now, we simulate success
        return Promise.resolve({ success: true });
    }
}

// Export singleton instance
export const importService = new ImportService();
