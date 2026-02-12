---
description: 测试流程和命令
---

# 测试工作流

## 运行测试命令

// turbo
1. 运行所有单元测试
```bash
npm run test
```

// turbo
2. 运行测试并查看覆盖率
```bash
npm run test -- --coverage
```

// turbo
3. 运行特定测试文件
```bash
npm run test -- <filename>
```

// turbo
4. 监听模式 (开发时使用)
```bash
npm run test -- --watch
```

## 测试文件规范

- 测试文件与源文件同名，添加 `.test.ts` 后缀
- 使用 `describe` 分组相关测试
- 使用 `it` 描述具体行为

```typescript
describe('WardrobeService', () => {
  it('fetches items successfully', async () => {
    // 测试逻辑
  });
});
```

## 构建验证

// turbo-all

1. TypeScript 类型检查
```bash
npx tsc --noEmit
```

2. ESLint 检查
```bash
npm run lint
```

3. 生产构建
```bash
npm run build
```

## 提交前检查清单

- [ ] 所有测试通过
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告
- [ ] 生产构建成功
