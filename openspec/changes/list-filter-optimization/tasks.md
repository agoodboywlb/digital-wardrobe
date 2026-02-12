## 1. 依赖安装与基础设施

- [x] 1.1 安装 `pinyin-pro` 依赖 (`npm install pinyin-pro`)
- [x] 1.2 在 `useWardrobe` hook 中扩展筛选状态：新增 `activeBrands: string[]`、`priceRange: { min?: number; max?: number } | null`

## 2. 拼音搜索能力

- [x] 2.1 创建拼音工具模块 `src/utils/helpers/pinyinSearch.ts`：封装 `pinyin-pro` 的动态加载、拼音首字母提取、索引构建逻辑
- [x] 2.2 在 `useWardrobe` hook 中：items 加载后异步预计算拼音首字母索引（name/brand/tags），缓存到 ref/state
- [x] 2.3 扩展 `useWardrobe` 中的搜索过滤逻辑：当搜索词全为字母时，额外进行拼音首字母前缀匹配，与原有搜索结果取并集
- [x] 2.4 编写 `pinyinSearch.ts` 的单元测试：覆盖单字母/多字母/大小写/多音字/非字母输入场景

## 3. 品牌筛选

- [x] 3.1 在 `useWardrobe` hook 中新增 `availableBrands` 计算逻辑：从 items 中提取去重、trim、大小写归一化后的品牌列表，按频率降序排列
- [x] 3.2 扩展 `AdvancedFilterDrawer` 组件：新增「品牌」筛选区块，使用 Chip 组件展示品牌列表，支持多选
- [x] 3.3 实现品牌列表截断逻辑：超过 12 个品牌时显示「展开全部」按钮
- [x] 3.4 在 `useWardrobe` 的 `filteredItems` 中集成品牌筛选逻辑：当 `activeBrands` 不为空时，仅保留品牌匹配的项目

## 4. 价格区间筛选

- [x] 4.1 扩展 `AdvancedFilterDrawer` 组件：新增「价格区间」筛选区块，包含 4 个预设按钮（¥0-100, ¥100-300, ¥300-500, ¥500+）
- [x] 4.2 在预设按钮下方添加自定义 min/max 输入框，实现预设与自定义输入的双向同步
- [x] 4.3 在 `useWardrobe` 的 `filteredItems` 中集成价格区间过滤逻辑：排除无价格项，按 min/max 范围过滤

## 5. 筛选状态指示器

- [x] 5.1 扩展 `WardrobePage` 中的筛选状态标签区域：为品牌和价格区间新增可移除标签
- [x] 5.2 为每个筛选标签实现点击 × 移除功能：移除品牌标签时从 `activeBrands` 中剔除，移除价格标签时清空 `priceRange`
- [x] 5.3 更新 `resetFilters` 函数：覆盖所有新增的筛选维度

## 6. Props 和类型更新

- [x] 6.1 扩展 `AdvancedFilterDrawerProps` 接口：新增品牌和价格区间相关 props
- [x] 6.2 更新 `WardrobePage` 中对 `AdvancedFilterDrawer` 的调用，传入新增 props
- [x] 6.3 确保 TypeScript strict 模式下零类型错误

## 7. 验证与质量

- [x] 7.1 端到端手动测试：品牌多选筛选、价格区间切换、拼音搜索、筛选标签移除
- [x] 7.2 ESLint 零 warning 检查
- [x] 7.3 验证移动端响应式布局：筛选面板在小屏幕上的展示和滚动体验
