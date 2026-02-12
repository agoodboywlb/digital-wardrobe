
import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database'

// These should be in .env.local
// VITE_SUPABASE_URL=...
// VITE_SUPABASE_ANON_KEY=...

const supabaseUrl = (import.meta.env['VITE_SUPABASE_URL'] as string) || '';
const supabaseAnonKey = (import.meta.env['VITE_SUPABASE_ANON_KEY'] as string) || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Check your .env.local file.');
}

export const supabase = createClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
