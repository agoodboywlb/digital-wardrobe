# 实现计划: 单品多图支持 (Multi-Image Support)

- **功能名称**: Multi-Image Support
- **目标**: 支持单品关联最多 8 张图片，保持主图同步，提供详情页轮播和编辑页管理能力。
- **架构**: 
  - 数据库：`item_images` 关联表 (1:N)
  - 同步策略：双写模式 (`items.image_url` 与 `item_images.is_primary` 同步)
  - 开发流程：TDD (Service 层) + 组件驱动开发 (UI 层)
- **技术栈**: React 19, Supabase, Lucide-React, Tailwind CSS

---

## 任务列表

### 1. 数据库层 (DB Layer)

#### 任务 1.1: 创建迁移脚本
- **目标**: 建立 `item_images` 表及 RLS 策略。
- **文件**: `wardrobe-front/supabase/migrations/03_add_item_images.sql`
- **代码**:
  ```sql
  --- SQL Content ---
  CREATE TABLE public.item_images (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      label TEXT, -- front, back, label, worn, detail
      sort_order INTEGER DEFAULT 0,
      is_primary BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now(),
      user_id UUID DEFAULT auth.uid()
  );

  ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can CRUD own item images" ON public.item_images
      FOR ALL USING (auth.uid() = user_id);
  ```
- **验证**: `npx supabase db lint` (如本地有环境)

#### 任务 1.2: 更新 TypeScript 类型
- **目标**: 在前端同步数据库和业务类型。
- **文件**: 
  - `wardrobe-front/src/types/database.ts` (同步 `item_images` 表定义)
  - `wardrobe-front/src/types/index.ts` (新增 `ItemImage` 接口，更新 `ClothingItem`)
- **验证**: `npm run type-check`

---

### 2. Service 层实现 (TDD Flow)

#### 任务 2.1: 增强 `fetchItem` 与映射逻辑
- **目标**: 使 `mapToClothingItem` 处理 `item_images`。
- **修改文件**: `wardrobe-front/src/features/wardrobe/services/wardrobeService.ts`
- **测试文件**: `wardrobe-front/src/features/wardrobe/services/__tests__/wardrobeService.test.ts`
- **步骤**:
  1. 写测试: 断言 `fetchItem` 返回的对象包含 `images` 数组。
  2. 修改 `fetchItem` 的 SQL: `.select('*, item_images(*)')`。
  3. 修改 `mapToClothingItem`: 处理关联数据。
- **验证**: `npm test wardrobeService.test.ts`

#### 任务 2.2: 实现多图管理核心方法
- **目标**: 实现 `addItemImage`, `deleteItemImage`, `setPrimaryImage`, `reorderImages`。
- **重点**: 同步更新 `items.image_url`。
- **验证**: 为每个方法编写对应的 Test Case。

---

### 3. UI 组件开发

#### 任务 3.1: `ImageGallery` (详情页轮播)
- **目标**: 支持左右滑动预览，兼容单图。
- **文件**: `wardrobe-front/src/components/common/ImageGallery.tsx`
- **特性**: 
  - `images: ItemImage[] | string`
  - 如果只有主图 URL，展示静态图。
  - 多图则展示带 Dot 的水平 Scroll Area。

#### 任务 3.2: `MultiImageUploader` (编辑/添加页)
- **目标**: 4列网格展示，支持移除、设为主图、添加新图。
- **文件**: `wardrobe-front/src/components/common/MultiImageUploader.tsx`

---

### 4. 页面集成

#### 任务 4.1: `ItemDetailPage` 改造
- **目标**: 替换 `OptimizedImage` 为 `ImageGallery`。
- **验证**: 视觉检查。

#### 任务 4.2: `AddItemPage` & `EditItemPage` 改造
- **目标**: 替换单图上传逻辑，适配多图。
- **逻辑**: 保存时先上传所有新图片，然后更新 DB 映射。

---

## 验证与验收 criteria

1. **类型安全**: TS 零错误。
2. **向后兼容**: 只有单图的老数据依然能正常显示（不显示轮播点）。
3. **主图同步**: 修改主图后，列表页缩略图立即生效。
4. **上限限制**: 尝试上传第 9 张图时报错提示。
