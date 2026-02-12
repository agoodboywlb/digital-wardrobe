-- Digital Wardrobe - Full Schema Initialization
-- Version: 1.0.0

-- 1. Create Enums
CREATE TYPE public.category AS ENUM ('tops', 'bottoms', 'outerwear', 'footwear', 'accessories');
CREATE TYPE public.season AS ENUM ('spring', 'summer', 'autumn', 'winter');
CREATE TYPE public.item_status AS ENUM ('in_wardrobe', 'to_wash', 'at_tailor', 'dry_cleaning');
CREATE TYPE public.import_status AS ENUM ('parsed', 'parsing', 'review_needed', 'imported');
CREATE TYPE public.outfit_status AS ENUM ('planned', 'completed');

-- 2. Create Tables
-- Items table
CREATE TABLE public.items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    category public.category NOT NULL,
    sub_category TEXT,
    image_url TEXT,
    brand TEXT,
    size TEXT,
    material TEXT,
    purchase_date DATE,
    last_worn TIMESTAMPTZ,
    status public.item_status DEFAULT 'in_wardrobe'::public.item_status,
    tags TEXT[],
    price NUMERIC(10, 2),
    cpw NUMERIC(10, 2),
    wear_count INTEGER DEFAULT 0,
    user_id UUID DEFAULT auth.uid()
);

-- Import records table
CREATE TABLE public.import_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    order_id TEXT,
    date DATE,
    price NUMERIC(10, 2),
    status public.import_status DEFAULT 'parsing'::public.import_status,
    image_url TEXT,
    user_id UUID DEFAULT auth.uid()
);

-- Outfits table
CREATE TABLE public.outfits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    date DATE,
    time TIME,
    occasion TEXT,
    season public.season,
    status public.outfit_status DEFAULT 'planned'::public.outfit_status,
    user_id UUID DEFAULT auth.uid()
);

-- Outfit Items (Junction table)
CREATE TABLE public.outfit_items (
    outfit_id UUID REFERENCES public.outfits(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    PRIMARY KEY (outfit_id, item_id)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_items ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Authenticated per-user access)
-- Items
CREATE POLICY "Users can view own items" ON public.items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own items" ON public.items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON public.items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own items" ON public.items FOR DELETE USING (auth.uid() = user_id);

-- Import Records
CREATE POLICY "Users can view own imports" ON public.import_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own imports" ON public.import_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own imports" ON public.import_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own imports" ON public.import_records FOR DELETE USING (auth.uid() = user_id);

-- Outfits
CREATE POLICY "Users can view own outfits" ON public.outfits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own outfits" ON public.outfits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own outfits" ON public.outfits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own outfits" ON public.outfits FOR DELETE USING (auth.uid() = user_id);

-- Outfit Items
CREATE POLICY "Users can view own outfit items" ON public.outfit_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.outfits WHERE id = outfit_items.outfit_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own outfit items" ON public.outfit_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.outfits WHERE id = outfit_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own outfit items" ON public.outfit_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.outfits WHERE id = outfit_items.outfit_id AND user_id = auth.uid())
);

-- 5. Storage Configuration
-- Create bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wardrobe_images', 'wardrobe_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'wardrobe_images' AND auth.role() = 'authenticated' );

CREATE POLICY "Public access to images"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'wardrobe_images' );
