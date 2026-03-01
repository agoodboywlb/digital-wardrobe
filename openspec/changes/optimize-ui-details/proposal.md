## Why

为了提升用户体验，需要优化 UI 细节，包括加载状态的感知速度和标签样式的视觉统一。

## What Changes

- **加载状态优化**: 全局统一使用骨架屏 (Skeleton) 代替简单的 Loading Spinner，提升感知速度。
- **标签样式统一**: 统一 "属性标签" (灰色) 与 "自定义标签" (彩色) 的视觉规范。

## Capabilities

### New Capabilities
- `ui-skeleton`: 全局骨架屏组件及加载状态管理。
- `ui-tag-system`: 统一的标签样式系统。

### Modified Capabilities
- `item-display`: 修改单品展示中的加载和标签显示逻辑。

## Impact

- 前端组件库
- 所有涉及列表和详情展示的页面
