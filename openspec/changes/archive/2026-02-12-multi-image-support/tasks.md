## 1. 数据库层

- [x] 1.1 创建迁移脚本 `03_add_item_images.sql`：新建 `item_images` 表（id, item_id FK CASCADE, image_url, label, sort_order, is_primary, created_at, user_id），启用 RLS，添加用户级 CRUD 策略
- [x] 1.2 更新 `types/database.ts`：新增 `item_images` 表的 Row / Insert / Update 类型定义

## 2. 类型系统

- [x] 2.1 在 `types/index.ts` 中新增 `ItemImage` 接口（id, itemId, imageUrl, label, sortOrder, isPrimary, createdAt）
- [x] 2.2 在 `ClothingItem` 接口中新增可选字段 `images?: ItemImage[]`

## 3. Service 层

- [x] 3.1 在 `wardrobeService.ts` 中新增 `fetchItemImages(itemId: string): Promise<ItemImage[]>` 方法
- [x] 3.2 在 `wardrobeService.ts` 中新增 `addItemImage(itemId: string, imageUrl: string, label?: string): Promise<ItemImage>` 方法，自动分配 `sort_order`，第一张图自动标记 `is_primary = true` 并同步 `items.image_url`
- [x] 3.3 在 `wardrobeService.ts` 中新增 `deleteItemImage(imageId: string): Promise<void>` 方法，删除主图时自动晋升下一张，同步 `items.image_url`
- [x] 3.4 在 `wardrobeService.ts` 中新增 `setPrimaryImage(imageId: string, itemId: string): Promise<void>` 方法，更新 `is_primary` 标记并同步 `items.image_url`
- [x] 3.5 在 `wardrobeService.ts` 中新增 `reorderImages(imageIds: string[]): Promise<void>` 方法，批量更新 `sort_order`
- [x] 3.6 修改 `fetchItem()` 方法，使用 Supabase 关联查询一次性获取 `item_images`，填充 `images` 字段

## 4. UI 组件 — MultiImageUploader

- [x] 4.1 创建 `src/components/common/MultiImageUploader.tsx`：网格布局展示已选图片缩略图（4 列），末尾显示 "+" 添加按钮
- [x] 4.2 支持点击缩略图设置为主图（长按或角标 ⭐），主图显示皇冠/星标
- [x] 4.3 支持点击缩略图右上角 "×" 删除图片
- [x] 4.4 支持拖拽排序（移动端 touch 事件），拖动时显示阴影反馈
- [x] 4.5 显示图片数量计数器 `(n/8)`，达到上限时隐藏添加按钮

## 5. UI 组件 — ImageGallery

- [x] 5.1 创建 `src/components/common/ImageGallery.tsx`：水平滑动轮播，底部圆点指示器，支持左右滑动切换
- [x] 5.2 支持点击图片进入全屏预览模式（overlay + pinch-to-zoom + swipe-to-dismiss）
- [x] 5.3 兼容单图模式：当 `images` 为空时回退展示 `imageUrl`，不显示指示器

## 6. 页面集成 — AddItemPage

- [x] 6.1 将现有单图上传区域替换为 `MultiImageUploader` 组件
- [x] 6.2 修改 `handleSave` 逻辑：先上传所有新图片获取 URL 数组，创建 item 后批量插入 `item_images`，首图同步至 `items.image_url`

## 7. 页面集成 — EditItemPage

- [x] 7.1 加载现有 `item_images` 数据填充 `MultiImageUploader`
- [x] 7.2 修改保存逻辑：对比新旧图片列表，新增图片调用 `addItemImage`，被删除的调用 `deleteItemImage`，排序变更调用 `reorderImages`，主图变更调用 `setPrimaryImage`

## 8. 页面集成 — ItemDetailPage

- [x] 8.1 将单图展示替换为 `ImageGallery` 组件
- [x] 8.2 在图片下方显示当前图片的 `label` 标签（如有）

## 9. 测试与验证

- [x] 9.1 为 Service 层新方法编写单元测试（fetchItemImages, addItemImage, deleteItemImage, setPrimaryImage）
- [x] 9.2 验证向后兼容：已有单品（无 item_images 记录）在详情页、列表页、搭配页正常展示
- [x] 9.3 验证图片上限：达到 8 张后添加按钮隐藏且上传被拒绝
- [x] 9.4 验证主图同步：设置主图 / 删除主图后 `items.image_url` 正确更新
- [x] 9.5 TypeScript 严格模式类型检查通过，ESLint 零 warning
