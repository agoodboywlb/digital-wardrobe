## Context

当前项目中，加载状态使用简单的 Loading Spinner，视觉反馈较为生硬。标签样式（属性标签与自定义标签）缺乏统一的视觉规范。为了提升 App 的精致感和感知速度，需要引入骨架屏并统一标签系统。

## Goals / Non-Goals

**Goals:**
- 引入全局 `Skeleton` 组件。
- 统一 `Tag` 组件的视觉规范。
- 在主要页面（列表页、详情页、编辑页）应用骨架屏。

**Non-Goals:**
- 不涉及后端 API 的更改。
- 不涉及复杂的动画效果优化。

## Decisions

### 1. 骨架屏实现方式
- **Decision**: 使用 `shadcn/ui` 风格的 `Skeleton` 组件。
- **Rationale**: 易于组合，能够精确匹配现有组件的布局。
- **Alternatives**: 使用第三方骨架屏库（如 `react-loading-skeleton`），但为了减少依赖并保持样式一致性，选择自研或基于 `shadcn/ui` 实现。

### 2. 标签样式规范
- **Decision**: 
  - 属性标签（Category, Color, etc.）：背景 `#F3F4F6` (Gray 100)，文字 `#374151` (Gray 700)。
  - 自定义标签：背景色根据名称哈希生成，文字白色。
- **Rationale**: 区分系统属性和用户自定义内容，增强信息层级感。

## Risks / Trade-offs

- **[Risk]** 骨架屏布局与实际内容不匹配导致闪烁 → **[Mitigation]** 骨架屏组件应严格遵循对应业务组件的尺寸和间距。
