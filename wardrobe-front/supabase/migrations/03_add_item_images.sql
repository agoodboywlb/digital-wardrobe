-- digital-wardrobe - Multi-Image Support Migration
-- Version: 1.1.0
-- Description: Adds item_images table to support multiple images per clothing item.

-- 1. Create item_images table
CREATE TABLE IF NOT EXISTS public.item_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    label TEXT, -- Suggesed: 'front', 'back', 'label', 'worn', 'detail'
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID DEFAULT auth.uid()
);

-- 2. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_item_images_item_id ON public.item_images(item_id);
CREATE INDEX IF NOT EXISTS idx_item_images_user_id ON public.item_images(user_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Users can only see and manage their own images
CREATE POLICY "Users can view own item images" ON public.item_images
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own item images" ON public.item_images
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own item images" ON public.item_images
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own item images" ON public.item_images
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Helper function/trigger (Optional but recommended)
-- Ensure only one is_primary=true per item_id
-- We will handle this in service layer for now to maintain consistency with external items.image_url,
-- but a DB trigger would be more robust in the future.
