-- ============================================
-- 数据权限功能 - 数据库迁移脚本 (已修复)
-- 执行日期: 2026-02-10
-- 说明: 
-- 1. 为 outfit_items 添加缺失的 user_id 字段
-- 2. 将所有表的 user_id 字段改为 NOT NULL
-- 3. 将历史数据分配给第一个用户
-- ============================================

-- 步骤 0: 检查并添加 user_id 列 (针对 junction table)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='outfit_items' AND column_name='user_id') THEN
        ALTER TABLE outfit_items ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 步骤 1: 将核心表历史数据分配给第一个用户
-- 注意: 如果没有用户,请在 Supabase Auth 中先创建一个账号
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    SELECT id INTO first_user_id FROM auth.users ORDER BY created_at LIMIT 1;

    IF first_user_id IS NOT NULL THEN
        -- 分配 items
        UPDATE items SET user_id = first_user_id WHERE user_id IS NULL;
        -- 分配 outfits
        UPDATE outfits SET user_id = first_user_id WHERE user_id IS NULL;
        -- 分配 import_records
        UPDATE import_records SET user_id = first_user_id WHERE user_id IS NULL;
        
        -- 分配 outfit_items (根据关联的 outfit 同步用户)
        UPDATE outfit_items oi
        SET user_id = o.user_id
        FROM outfits o
        WHERE oi.outfit_id = o.id AND oi.user_id IS NULL;
        
        -- 如果还有遗漏的 outfit_items (比如关联的 outfit 被删了), 分配给第一个用户
        UPDATE outfit_items SET user_id = first_user_id WHERE user_id IS NULL;
    END IF;
END $$;

-- 步骤 2: 修改字段为 NOT NULL
ALTER TABLE items ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE outfits ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE outfit_items ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE import_records ALTER COLUMN user_id SET NOT NULL;

-- 步骤 3: 验证迁移结果
SELECT 'items' AS table_name, COUNT(*) AS null_count FROM items WHERE user_id IS NULL
UNION ALL
SELECT 'outfits', COUNT(*) FROM outfits WHERE user_id IS NULL
UNION ALL
SELECT 'outfit_items', COUNT(*) FROM outfit_items WHERE user_id IS NULL
UNION ALL
SELECT 'import_records', COUNT(*) FROM import_records WHERE user_id IS NULL;

-- 步骤 4: 创建索引 (如果不存在)
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_items_user_id ON outfit_items(user_id);
CREATE INDEX IF NOT EXISTS idx_import_records_user_id ON import_records(user_id);
