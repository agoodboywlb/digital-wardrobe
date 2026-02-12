# Digital Wardrobe 项目规范

> 项目类型: 移动端优先的衣橱管理 Web App  
> 技术栈: React 19 + TypeScript 5.8 + Vite 6 + Supabase

---

## 技术栈

- **Frontend**: React 19, TypeScript 5.8, Vite 6
- **Backend**: Supabase (Auth + Database + Storage)
- **Styling**: Vanilla CSS (CSS Variables)
- **Testing**: Vitest + Testing Library

---

## 核心目录结构

```
src/
├── components/      # 通用组件 (common/, layout/)
├── features/        # 功能模块 (wardrobe/, outfit/, stats/)
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── hooks/           # 全局 Hooks
├── lib/             # 第三方库配置 (supabase.ts)
├── pages/           # 页面组件
├── services/        # 全局服务层
├── styles/          # 全局样式
├── types/           # 全局类型
└── utils/           # 工具函数
```

---

## 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 组件 | PascalCase | `WardrobeList.tsx` |
| 工具/服务 | camelCase | `wardrobeService.ts` |
| Hook | use 前缀 | `useWardrobe.ts` |
| 类型 | PascalCase | `ClothingItem.ts` |
| 常量 | UPPER_SNAKE | `API_ENDPOINTS.ts` |

---

## TypeScript 规范

- **严格模式**: `strict: true`
- **禁止 any**: 使用 `unknown` + 类型守卫
- **interface vs type**: 对象用 interface，联合类型用 type

---

## Service 层设计

```typescript
// 使用 Class 封装，单例导出
export class WardrobeService {
  async fetchItems(): Promise<ClothingItem[]> { ... }
  async addItem(item: CreateItemDTO): Promise<ClothingItem> { ... }
}
export const wardrobeService = new WardrobeService();
```

---

## 环境变量

```bash
# .env.local (不提交到 Git)
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx
```

---

## 开发命令

```bash
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run test     # 运行测试
npm run lint     # ESLint 检查
```

---

## 数据权限与隔离

1. **认证守卫**: 使用 `ProtectedRoute` 组件统一拦截业务路由，确保未授权用户无法访问。
2. **多租户隔离**: Service 层必须通过 `BaseService.getCurrentUserId()` 获取当前用户 ID：
   - **查询**: 必须显式添加 `.eq('user_id', userId)`。
   - **写入**: 插入数据时自动注入 `user_id`，更新/删除时必须带上 `user_id` 校验。
3. **数据库约束**: 核心业务表（`items`, `outfits` 等）的 `user_id` 字段必须为 `NOT NULL`。

---

## 图片处理与优化规范

1. **上传预处理**: 所有图片在上传至 Supabase Storage 前必须经过 `getCroppedImg` 处理：
   - **格式强制**: 统一转换为 `image/webp` 格式以减小体积。
   - **尺寸限制**: 最大宽度限制为 `1200px`，超过则等比例缩放。
   - **质量压缩**: 保持 `0.8` 的压缩质量。
2. **编辑功能**: 集成 `react-easy-crop` 和 `smartcrop`：
   - 支持 90 度旋转、缩放、1:1 比例裁剪。
   - 提供"智能识别"按钮，辅助用户快速定位主体区域。
3. **加载优化**: 核心展示区域必须使用 `OptimizedImage` 组件：
   - **二级缓存**: 自动使用浏览器的 `Cache API` 进行持久化本地存储，支持离线查看及瞬时加载。

---

## 智能搭配与助手规范

1. **架构模式**: 采用独立 Feature 模块 (`src/features/assistant`)，保持核心业务纯净。
2. **AI 服务集成**:
    - **后端**: Python FastAPI + Google GenAI (Gemini 3 Flash)
    - **端点**: `POST /generate-outfit` (运行在 `http://localhost:8000`)
    - **环境变量**: `VITE_AI_SERVICE_URL` (在 `.env.local` 中配置)
    - **降级策略**: AI 服务失败时自动回退到规则引擎
3. **推荐流程**:
    - **输入**: 用户衣橱单品(仅 `in_wardrobe` 状态) + 天气数据 + 穿搭风格(vibe)
    - **输出**: AI 生成的搭配标题、造型师建议、选中单品 ID、风格分类
4. **规则引擎 (Fallback)**:
    - **基础规则**: 1上装 + 1下装
    - **温度阈值**: < 15°C 追加 `outerwear`，> 28°C 推荐清凉材质
    - **随机因子**: 20% 概率追加 `accessories`

---

## 详细规范

完整的代码示例、样式规范、测试规范请参考：
- [PROJECT_STANDARDS.md](.agent/PROJECT_STANDARDS.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)

## 工作流

- Git 提交: `.agent/workflows/git-commit.md`
- 测试流程: `.agent/workflows/testing.md`
- 代码审查: 使用全局 skill `requesting-code-review`
