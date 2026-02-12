## Why

当前单品详情页和搭配详情页缺乏快捷操作入口，用户执行删除或全屏查看图片等高频操作时，必须进入编辑页面或经过多步点击，交互路径过长。

## What Changes

- **详情页快捷删除**: 在单品详情页和搭配详情页增加直接删除按钮。
- **图片全屏预览**: 支持点击详情页图片进行全屏查看。

## Capabilities

### New Capabilities
- `detail-quick-actions`: 提供详情页的快捷操作功能，包括直接删除和图片全屏预览。

### Modified Capabilities
<!-- 无 -->

## Impact

- `src/features/wardrobe/components/ItemDetail.tsx` (或类似组件)
- `src/features/outfit/components/OutfitDetail.tsx` (或类似组件)
- 相关的 UI 组件库（如按钮、图片预览组件）
