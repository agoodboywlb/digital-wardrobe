---
description: Git 提交规范和分支策略
---

# Git 提交工作流

## Commit 规范 (Conventional Commits)

```bash
# 格式
<type>(<scope>): <subject>

# 类型 (type)
feat:     新功能
fix:      Bug 修复
docs:     文档更新
style:    代码格式调整 (不影响功能)
refactor: 重构 (既不是新功能也不是修复)
perf:     性能优化
test:     测试相关
chore:    构建/工具链更新
```

## 示例

```bash
feat(wardrobe): add filter by category
fix(outfit): resolve image upload error
docs(readme): update installation guide
refactor(services): extract common API logic
```

## 分支策略

```bash
# 主分支
main       # 生产环境
develop    # 开发环境

# 功能/修复分支
feature/wardrobe-filter
fix/image-upload-error
hotfix/critical-bug
release/v1.0.0
```

## 提交步骤

// turbo
1. 检查当前状态
```bash
git status
```

// turbo
2. 暂存更改
```bash
git add .
```

3. 提交 (使用规范格式)
```bash
git commit -m "feat(wardrobe): add new feature"
```

// turbo
4. 推送分支
```bash
git push origin <branch-name>
```

## PR 模板

```markdown
## 📝 变更说明
简要描述本次 PR 的目的

## 🔗 关联 Issue
Closes #123

## ✅ 检查清单
- [ ] 代码符合项目规范
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告
- [ ] 已添加必要测试
```
