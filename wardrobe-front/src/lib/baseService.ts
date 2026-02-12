
import { supabase } from '@/lib/supabase';

import type { Database } from '@/types/database';
import type { SupabaseClient } from '@supabase/supabase-js';

export class BaseService {
    protected client: SupabaseClient<Database>;

    constructor(client: SupabaseClient<Database> = supabase) {
        this.client = client;
    }

    /**
     * Get the current authenticated user's ID
     * @throws Error if user is not authenticated
     */
    protected async getCurrentUserId(): Promise<string> {
        const { data, error } = await this.client.auth.getUser();

        if (error || !data.user) {
            this.handleError(
                new Error('用户未登录或会话已过期'),
                'getCurrentUserId'
            );
        }

        return data.user.id;
    }

    protected handleError(error: unknown, context: string): never {
        console.error(`[${context}] Error:`, error);
        const message = error instanceof Error ? error.message :
            (typeof error === 'object' && error !== null && 'message' in error) ? String((error as { message: unknown }).message) :
                'An unexpected error occurred';
        throw new Error(message);
    }
}
