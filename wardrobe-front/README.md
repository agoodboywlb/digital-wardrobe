# 🎨 Digital Wardrobe - 智能数字衣橱

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-19.2-61dafb)

一款现代化的智能衣橱管理应用,帮助你更好地管理和搭配你的服装。

[功能特性](#-功能特性) • [技术栈](#-技术栈) • [快速开始](#-快速开始) • [项目结构](#-项目结构) • [文档](#-文档) • [开发规范](#-开发规范)

</div>

---

## ✨ 功能特性

- 📸 **衣物管理** - 拍照上传,智能分类,轻松管理你的每一件衣物
- 👔 **搭配规划** - AI 智能推荐搭配,告别选择困难症
- 📊 **数据统计** - 可视化展示衣橱数据,了解你的穿衣习惯
- 💰 **价值分析** - CPW (Cost Per Wear) 计算,理性消费
- 🔄 **状态追踪** - 跟踪衣物状态 (在柜/待洗/修改中/干洗中)
- 🌓 **深色模式** - 支持浅色/深色主题切换
- 📱 **响应式设计** - 完美适配移动端和桌面端

## 🛠️ 技术栈

### 核心框架
- **React 19.2** - 最新的 React 版本,支持并发特性
- **TypeScript 5.8** - 类型安全的 JavaScript 超集
- **Vite 6** - 极速的前端构建工具

### UI & 样式
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide React** - 精美的图标库
- **Recharts** - 数据可视化图表库

### 后端服务
- **Supabase** - 开源的 Firebase 替代方案
  - PostgreSQL 数据库
  - 实时订阅
  - 文件存储
  - 行级安全策略 (RLS)

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git Hooks 管理
- **lint-staged** - 暂存文件检查
- **Vitest** - 单元测试框架
- **Testing Library** - React 组件测试

## 🚀 快速开始

### 前置要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **pnpm** >= 8.0.0

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/yourusername/digital-wardrobe.git
cd digital-wardrobe
```

2. **安装依赖**

```bash
npm install
# 或
pnpm install
```

3. **配置环境变量**

复制 `.env.local.example` 到 `.env.local` 并填入你的配置:

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **初始化数据库**

在 Supabase 控制台执行以下 SQL 文件:
- `supabase/migrations/00_init_schema.sql` - 全量初始化表结构、枚举及 RLS 策略
- `supabase/scripts/allow_anon_access.sql` - (可选) 开发环境下一键放通权限 (允许匿名访问)

5. **启动开发服务器**

```bash
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
digital-wardrobe/
├── .agent/                    # AI Agent 配置
├── ../docs/                   # 全局项目文档
├── src/                       # 源代码 (待重构为标准结构)
│   ├── components/            # 通用组件
│   ├── pages/                 # 页面组件
│   ├── services/              # 服务层
│   ├── lib/                   # 第三方库配置
│   ├── types/                 # 类型定义
│   ├── utils/                 # 工具函数
│   ├── App.tsx                # 应用入口
│   └── main.tsx               # 主入口
├── tests/                     # 测试文件
│   └── setup.ts               # 测试环境配置
├── public/                    # 静态资源
├── .eslintrc.cjs              # ESLint 配置
├── .prettierrc                # Prettier 配置
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
├── vitest.config.ts           # Vitest 配置
└── package.json               # 项目配置
```

## 📚 文档

- **[产品需求与迭代规划 (Product Roadmap)](../docs/PRODUCT_ROADMAP.md)**
  - 项目愿景与目标
  - 当前功能与待办事项 (Backlog)
  - 迭代路线图 (Runway)

## 📜 可用脚本

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览生产构建

# 代码质量
npm run lint             # 运行 ESLint 检查
npm run lint:fix         # 自动修复 ESLint 问题
npm run format           # 格式化代码
npm run format:check     # 检查代码格式
npm run type-check       # TypeScript 类型检查
npm run validate         # 运行所有检查 (类型+lint+格式)

# 测试
npm run test             # 运行测试
npm run test:ui          # 运行测试 UI
npm run test:coverage    # 生成测试覆盖率报告
```

## 🎯 开发规范

本项目遵循严格的开发规范,详见 [`docs/PROJECT_STANDARDS.md`](../docs/PROJECT_STANDARDS.md)

### 核心原则

1. **类型安全** - 启用 TypeScript 严格模式,禁止使用 `any`
2. **代码质量** - 所有代码必须通过 ESLint 检查
3. **代码格式** - 使用 Prettier 统一代码风格
4. **提交规范** - 遵循 Conventional Commits 规范
5. **测试覆盖** - 核心功能必须有单元测试

### Commit 规范

```bash
feat: 新功能
fix: Bug 修复
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具链更新
```

示例:
```bash
git commit -m "feat(wardrobe): add filter by category"
git commit -m "fix(outfit): resolve image upload error"
```

## 🔒 环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |
| `VITE_QWEATHER_KEY_ID` | 和风天气凭据 ID | ✅ |
| `VITE_QWEATHER_PROJECT_ID` | 和风天气项目 ID | ✅ |
| `VITE_QWEATHER_PRIVATE_KEY` | 和风天气 Ed25519 私钥 | ✅ |
| `VITE_QWEATHER_API_HOST` | 和风天气 API Host | ❌ |
| `VITE_WECHAT_APP_ID` | 微信公众号 AppID | ❌ |
| `VITE_WECHAT_APP_SECRET` | 微信公众号 AppSecret | ❌ |
| `VITE_WECHAT_REDIRECT_URI` | 微信授权回调地址 | ❌ |
| `GEMINI_API_KEY` | Gemini API 密钥 | ❌ |

### 和风天气 JWT 认证配置

本项目使用和风天气的 JWT 认证方式,相比 API Key 更加安全。详细配置步骤请参考:

📖 **[和风天气 JWT 认证配置指南](../docs/QWEATHER_JWT_SETUP.md)**

快速配置:
1. 在 [和风天气控制台](https://console.qweather.com/project) 获取凭据 ID 和项目 ID
2. 生成 Ed25519 密钥对并上传公钥到控制台
3. 在 `.env.local` 中配置私钥和相关参数

测试配置:
```bash
# 加载环境变量并运行测试脚本
source .env.local && node scripts/test-qweather-jwt.mjs
```

## 🧪 测试

```bash
# 运行所有测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 使用 UI 界面运行测试
npm run test:ui
```

## 📦 构建部署

### 本地构建

```bash
npm run build
```

构建产物将生成在 `dist/` 目录。

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### 环境变量配置

在 Vercel 项目设置中添加:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 贡献指南

欢迎贡献! 请遵循以下步骤:

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### Pull Request 检查清单

- [ ] 代码通过所有 lint 检查
- [ ] 代码通过类型检查
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 遵循项目代码规范

## 📝 待办事项

- [ ] 重构项目结构为 Feature-based 架构
- [ ] 添加单元测试覆盖
- [ ] 实现 CI/CD 流程
- [ ] 添加 E2E 测试
- [ ] 性能优化 (虚拟列表、图片懒加载)
- [ ] 国际化支持
- [ ] PWA 支持

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 🙏 致谢

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

**Made with ❤️ by Your Name**

[⬆ 回到顶部](#-digital-wardrobe---智能数字衣橱)

</div>
