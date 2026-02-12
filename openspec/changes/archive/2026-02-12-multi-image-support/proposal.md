## Why

当前每个单品仅支持单张图片（`image_url: string`），用户无法记录衣物的多角度细节（正面、背面、洗标、上身效果等）。这是产品路线图 P1 优先级的核心功能需求，直接影响用户的衣橱管理精细度和搭配决策质量。

## What Changes

- **新增 `item_images` 表**: 独立关联表存储单品的多张图片，包含图片 URL、类型标签（正面/背面/洗标/上身图）、排序权重。
- **主图逻辑**: `items.image_url` 保留作为主图（封面图），与 `item_images` 中 `is_primary = true` 的记录同步，确保向后兼容。
- **上传流程改造**: AddItemPage / EditItemPage 支持多图选择、预览、排序和删除，复用现有 `wardrobe_images` Storage Bucket。
- **详情页图片浏览**: ItemDetailPage 增加图片轮播/画廊组件，支持左右滑动和全屏预览。
- **类型系统扩展**: `ClothingItem` 接口新增 `images: ItemImage[]` 字段。

## Capabilities

### New Capabilities
- `item-multi-image`: 单品多图存储、上传、排序、展示的完整能力，包含数据库模型、Service 层、UI 组件。

### Modified Capabilities
无现有 spec 需要修改。

## Impact

- **数据库**: 新增 `item_images` 表 + RLS 策略 + 迁移脚本
- **前端类型**: `types/index.ts` (`ClothingItem`), `types/database.ts` (新增 `item_images` 表类型)
- **Service 层**: `wardrobeService.ts` — 新增 `fetchItemImages`, `addItemImages`, `deleteItemImage`, `reorderImages` 方法
- **页面**: `AddItemPage.tsx`, `EditItemPage.tsx`, `ItemDetailPage.tsx` — UI 改造
- **组件**: 新增 `ImageGallery` (详情页轮播), `MultiImageUploader` (编辑页多图上传) 组件
- **Storage**: 复用现有 `wardrobe_images` bucket，无额外依赖
