---
trigger: always_on
---

# digital-wardrobe 全局开发规范

> digital-wardrobe — 移动端优先的智能衣橱管理平台
> **交互语言: 简体中文**

## 项目架构总览

```text
digital-wardrobe/ (Root)
├── wardrobe-front/         # 前端 → 规范见 .agent/rules/wardrobe-front-rules.md
├── wardrobe-backend/
│   ├── ai-service/         # AI 服务 → 规范见 .agent/rules/ai-service-rules.md
│   └── java-service/       # Java 后端 (预留)
└── openspec/               # 变更规范与工件管理
```

| 子项目 | 语言 | 框架 | 质量工具 |
| :--- | :--- | :--- | :--- |
| `wardrobe-front` | TypeScript 5.8 | React 19 + Vite 6 | ESLint, Vitest |
| `ai-service` | Python 3.14 | FastAPI | Ruff, MyPy, Pytest |
| `java-service` | Java 17/21 | Spring Boot | — |

## 工作流与版本控制

1. **Git 规范**: 遵循 [Git Workflow](./git-workflow.md) (Conventional Commits)。
2. **变更管理**: 核心逻辑变更遵循 [OpenSpec](../openspec/) 流程，确保有据可查。

## 通用架构原则

1. **分层架构**: `API → Service → Model`，禁止跨层直接调用。
2. **单一职责**: 每个模块/类/函数只负责一个功能。
3. **配置驱动**: 禁止硬编码敏感信息，使用 `.env` 管理。
4. **类型安全**: TypeScript `strict: true`，Python `mypy --strict`。



## 质量红线 (Go/No-Go)

| 检查项 | 标准 | 级别 |
| :--- | :--- | :--- |
| 类型检查 | TS `strict` / MyPy `strict` 零错误 | 🔴 阻断 |
| 单元测试 | 核心 Service 层必须覆盖 | 🔴 阻断 |
| 敏感信息 | `.env` 禁止提交 Git | 🔴 阻断 |
| 数据隔离 | 查询必须带 `user_id` 过滤 | 🔴 阻断 |
| 代码风格 | ESLint / Ruff 零 warning | 🟡 警告 |