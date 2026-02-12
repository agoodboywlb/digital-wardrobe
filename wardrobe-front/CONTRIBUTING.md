# 贡献指南

感谢你考虑为 Digital Wardrobe 项目做出贡献! 🎉

## 行为准则

请遵循我们的行为准则,保持友好和尊重的交流环境。

## 如何贡献

### 报告 Bug

如果你发现了 Bug,请创建一个 Issue 并包含以下信息:

- **Bug 描述**: 清晰简洁地描述问题
- **复现步骤**: 详细的复现步骤
- **期望行为**: 你期望发生什么
- **实际行为**: 实际发生了什么
- **截图**: 如果适用,添加截图
- **环境信息**:
  - OS: [e.g. macOS 14.0]
  - Browser: [e.g. Chrome 120]
  - Node.js: [e.g. 18.17.0]

### 提出新功能

如果你有新功能的想法:

1. 先检查 Issues 中是否已有类似建议
2. 创建一个新的 Feature Request Issue
3. 清晰描述功能的用途和价值
4. 如果可能,提供设计稿或原型

### 提交代码

#### 开发流程

1. **Fork 仓库**

```bash
# 点击 GitHub 页面右上角的 Fork 按钮
```

2. **克隆你的 Fork**

```bash
git clone https://github.com/your-username/digital-wardrobe.git
cd digital-wardrobe
```

3. **添加上游仓库**

```bash
git remote add upstream https://github.com/original-owner/digital-wardrobe.git
```

4. **创建分支**

```bash
# 功能分支
git checkout -b feature/your-feature-name

# 修复分支
git checkout -b fix/your-bug-fix
```

5. **进行开发**

- 遵循项目的代码规范 (见 `../docs/PROJECT_STANDARDS.md`)
- 编写清晰的代码和注释
- 添加必要的测试

6. **提交更改**

```bash
# 暂存更改
git add .

# 提交 (遵循 Conventional Commits)
git commit -m "feat(wardrobe): add filter by season"
```

**Commit 消息格式**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链更新

**Scope**: 影响的模块 (wardrobe, outfit, stats, etc.)

**Subject**: 简短描述 (不超过 50 字符)

7. **运行检查**

```bash
# 类型检查
npm run type-check

# Lint 检查
npm run lint

# 格式检查
npm run format:check

# 运行测试
npm run test

# 或一次性运行所有检查
npm run validate
```

8. **推送到你的 Fork**

```bash
git push origin feature/your-feature-name
```

9. **创建 Pull Request**

- 访问你的 Fork 页面
- 点击 "New Pull Request"
- 填写 PR 模板
- 等待 Review

#### Pull Request 检查清单

提交 PR 前,请确保:

- [ ] 代码遵循项目规范
- [ ] 通过所有 TypeScript 类型检查
- [ ] 通过所有 ESLint 检查
- [ ] 代码已格式化 (Prettier)
- [ ] 添加了必要的测试
- [ ] 所有测试通过
- [ ] 更新了相关文档
- [ ] Commit 消息遵循规范
- [ ] PR 描述清晰完整

#### Pull Request 模板

```markdown
## 📝 变更说明
[简要描述本次 PR 的目的和内容]

## 🔗 关联 Issue
Closes #[issue number]

## ✅ 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 重构
- [ ] 文档更新
- [ ] 性能优化
- [ ] 其他: [请说明]

## 🧪 测试
- [ ] 单元测试已通过
- [ ] 集成测试已通过
- [ ] 手动测试已完成

## 📸 截图 (如适用)
[添加截图或 GIF]

## 📋 检查清单
- [ ] 代码符合项目规范
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告
- [ ] 所有测试通过
```

## 代码规范

### TypeScript

- 启用严格模式
- 禁止使用 `any`
- 优先使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型
- 为所有函数添加类型注解

### React

- 使用函数组件和 Hooks
- Props 必须有明确的类型定义
- 组件文件使用 PascalCase 命名
- 一个文件一个组件 (除非是紧密相关的小组件)

### 样式

- 使用 Tailwind CSS 实用类
- 避免内联样式
- 保持类名简洁有序

### 测试

- 为核心功能编写单元测试
- 测试文件命名: `*.test.ts` 或 `*.test.tsx`
- 使用描述性的测试名称
- 追求高测试覆盖率

## 项目结构

详见 [`../docs/PROJECT_STANDARDS.md`](../docs/PROJECT_STANDARDS.md)

## 开发环境设置

### 推荐的 IDE

- **VS Code** (推荐)
  - ESLint 扩展
  - Prettier 扩展
  - TypeScript 扩展

### VS Code 配置

创建 `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 获取帮助

如果你有任何问题:

1. 查看 [README.md](README.md)
2. 查看 [项目规范](../docs/PROJECT_STANDARDS.md)
3. 搜索现有的 Issues
4. 创建新的 Issue 提问

## 许可证

提交代码即表示你同意你的贡献将在 MIT 许可证下发布。

---

再次感谢你的贡献! 🙏
