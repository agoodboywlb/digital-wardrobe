-- Development Script: Allow Anonymous Access
-- Use this script for local development to bypass authentication

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own items" ON items;
DROP POLICY IF EXISTS "Users can insert own items" ON items;
DROP POLICY IF EXISTS "Users can update own items" ON items;
DROP POLICY IF EXISTS "Users can delete own items" ON items;

DROP POLICY IF EXISTS "Users can view own imports" ON import_records;
DROP POLICY IF EXISTS "Users can insert own imports" ON import_records;

DROP POLICY IF EXISTS "Users can view own outfits" ON outfits;
DROP POLICY IF EXISTS "Users can insert own outfits" ON outfits;
DROP POLICY IF EXISTS "Users can update own outfits" ON outfits;
DROP POLICY IF EXISTS "Users can delete own outfits" ON outfits;

DROP POLICY IF EXISTS "Users can view own outfit items" ON outfit_items;
DROP POLICY IF EXISTS "Users can insert own outfit items" ON outfit_items;
DROP POLICY IF EXISTS "Users can delete own outfit items" ON outfit_items;

-- 2. Create permissive policies (Allow all sessions)
CREATE POLICY "Allow all users to view items" ON items FOR SELECT USING (true);
CREATE POLICY "Allow all users to insert items" ON items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all users to update items" ON items FOR UPDATE USING (true);
CREATE POLICY "Allow all users to delete items" ON items FOR DELETE USING (true);

CREATE POLICY "Allow all users to view import records" ON import_records FOR SELECT USING (true);
CREATE POLICY "Allow all users to insert import records" ON import_records FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all users to view outfits" ON outfits FOR SELECT USING (true);
CREATE POLICY "Allow all users to insert outfits" ON outfits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all users to update outfits" ON outfits FOR UPDATE USING (true);
CREATE POLICY "Allow all users to delete outfits" ON outfits FOR DELETE USING (true);

CREATE POLICY "Allow all users to view outfit items" ON outfit_items FOR SELECT USING (true);
CREATE POLICY "Allow all users to insert outfit items" ON outfit_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all users to delete outfit items" ON outfit_items FOR DELETE USING (true);

-- Storage Policy Update (Allow anon upload if needed)
CREATE POLICY "Allow anon to upload images"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'wardrobe_images' );
