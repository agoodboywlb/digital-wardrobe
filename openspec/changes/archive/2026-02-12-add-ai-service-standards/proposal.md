## Why

`wardrobe-backend/ai-service` 目前是一个单文件 (`main.py`) 的扁平结构，缺乏明确的架构分层、依赖管理规范和自动化测试。
随着业务逻辑（如 LLM Prompt 复杂度增加、多模型支持、数据映射修正）的增加，维护成本和回归风险正在上升。
建立一套符合业界主流 Python 项目规范（PEP 8, Modern Directory Structure, TDD）的体系，是保证 AI 服务长期稳定和可扩展的基础。

## What Changes

1.  **目录结构重构**: 从扁平结构迁移到结构化的包结构（`src/` 布局或模块化布局）。
2.  **依赖管理升级**: 引入 `pyproject.toml` (PEP 621) 替代传统的 `requirements.txt`。
3.  **模块解耦**: 将 API 层、LLM 服务层、配置层和数据模型层严格分离。
4.  **工程化工具链**: 引入 `ruff` (格式化与 Lint)、`mypy` (类型检查) 和 `pytest` (测试框架)。
5.  **代码重构**: 按照新规范重构现有逻辑，消除 `main.py` 中的职责混杂。

## Capabilities

### New Capabilities
- `python-dev-standards`: 定义项目的核心工程化规范，包括目录树、代码风格工具链配置、TDD 流程。
- `ai-service-architecture`: 定义专用的 AI 服务分层架构（Schema -> Service -> Integration）。

### Modified Capabilities
- `generate-outfit-logic`: 增强现有的搭配生成逻辑，通过解耦提高 Prompt 管理和 ID 映射的鲁棒性。

## Impact

1.  **代码库**: 文件移动和模块拆分（重大变更）。
2.  **依赖**: 新增 `ruff`, `mypy`, `pytest` 等开发依赖。
3.  **运行环境**: 启动方式将从直接运行脚本变为通过模块运行或统一的 entry-point。
