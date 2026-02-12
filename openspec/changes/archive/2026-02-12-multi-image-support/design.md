## Context

当前 `items` 表使用单一 `image_url TEXT` 字段存储封面图。前端 `ClothingItem` 接口仅有 `imageUrl: string`。图片上传通过 `wardrobeService.uploadImage()` 上传到 Supabase Storage `wardrobe_images` bucket，返回公开 URL 写入 `image_url`。

现有图片处理链路：
1. **AddItemPage / EditItemPage**: 单文件选择 → ImageEditor 裁剪 → webp 压缩 → `uploadImage()` → 获得 URL
2. **ItemDetailPage**: 单张图片展示（`OptimizedImage` 组件）
3. **WardrobeItemCard / OutfitPreview**: 使用 `item.imageUrl` 渲染缩略图

## Goals / Non-Goals

**Goals:**
- 支持单品关联最多 8 张图片（正面、背面、洗标、上身图等）
- 保持 `items.image_url` 作为主图字段，确保所有现有引用（列表卡片、搭配预览、统计页等）完全向后兼容
- 详情页提供图片轮播浏览体验
- 添加/编辑页支持多图上传、预览、删除、拖拽排序、设置主图

**Non-Goals:**
- 图片 AI 识别或自动分类（属于 P2 智能化范畴）
- 视频支持
- 图片标注/文字叠加
- 多端同步优化（属于 P2 范畴）

## Decisions

### D1: 独立关联表 vs. JSON 数组字段

**选择: 独立关联表 `item_images`**

| 方案 | 优点 | 缺点 |
|:---|:---|:---|
| JSON 数组 (`images JSONB[]`) | 简单，无需新表 | 无法独立查询/索引，RLS 粒度不够，删除单张图片需全量更新 |
| 独立关联表 `item_images` | 标准关系模型，可独立 RLS/索引，支持精细操作 | 额外 JOIN 查询 |

**理由**: 图片数据有独立生命周期（上传、删除、排序），关联表更符合归一化原则。且 Supabase Postgrest 对关联查询有良好支持（`select('*, item_images(*)')`）。

### D2: 主图同步策略

**选择: 双写模式（`items.image_url` + `item_images.is_primary`）**

- `items.image_url` 保留作为"快捷访问"字段，避免修改所有消费方（列表/卡片/搭配/统计等 15+ 处引用）
- `item_images` 中 `is_primary = true` 的记录与 `items.image_url` 保持同步
- 新增/更换主图时，Service 层在同一事务中更新两处

**理由**: 渐进式重构，降低改动风险。未来可考虑将 `items.image_url` 标记为 deprecated。

### D3: 图片类型标签

**选择: 可选 `label` 字段（枚举建议 + 自由输入）**

预设建议值: `front`（正面）、`back`（背面）、`label`（洗标）、`worn`（上身图）、`detail`（细节）
存储为 `TEXT` 类型，前端提供快捷选择但允许自定义。

**理由**: 比严格枚举更灵活，适应用户多样化的拍照习惯。

### D4: UI 组件方案

- **详情页**: 自建轻量级 `ImageGallery` 组件（Swiper 式水平滑动 + 指示器 + 点击全屏），避免引入重量级轮播库
- **编辑页**: 自建 `MultiImageUploader` 组件（网格布局 + 添加按钮 + 长按拖拽排序 + 主图标识）

## Risks / Trade-offs

1. **[数据一致性]** `items.image_url` 与 `item_images.is_primary` 不一致 → 在 Service 层封装事务操作，确保原子更新
2. **[性能]** 详情页额外查询 `item_images` → 使用 Supabase 关联查询一次性获取，避免 N+1
3. **[存储成本]** 多图上传增加存储用量 → 限制单品最多 8 张图片，上传时强制 webp 压缩
4. **[迁移]** 现有数据只有 `image_url`，`item_images` 表为空 → 无需数据迁移，新功能渐进采用。详情页兼容处理：若 `item_images` 为空则回退展示 `items.image_url`
