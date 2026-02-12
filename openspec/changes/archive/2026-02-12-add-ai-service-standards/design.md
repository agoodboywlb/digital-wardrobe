## Context

目前 `wardrobe-backend/ai-service` 采用扁平的脚本模式开发，所有逻辑耦合在 `main.py` 中。
代码包含硬编码的环境变量读取、缺少类型提示的复杂逻辑，且没有自动化测试覆盖。

## Goals / Non-Goals

**Goals:**
- 实现代码分层：API (FastAPI) -> Service (Business Logic) -> Integration (LLM/Gemini)。
- 建立统一的配置中心和日志体系。
- 引入代码质量工具链（Ruff, MyPy）。
- 实现 100% 的核心业务逻辑（ID 映射与 Prompt 生成）测试覆盖。

**Non-Goals:**
- 不涉及前端代码修改。
- 不更换当前的适配器（Gemini 2.0 Flash）。
- 不改变现有的 API 接口协议。

## Decisions

### 1. 目录结构：包布局 (Package Layout)
将代码移动到 `src/` 或根项目的包目录下。
**决策**: 采用扁平的包结构：
- `ai_service/`
  - `api/`: 存放路由和依赖。
  - `services/`: 业务逻辑类。
  - `models/`: Pydantic 数据模型。
  - `core/`: 配置、常量、日志初始化。
  - `main.py`: 应用入口。

### 2. 依赖管理：pyproject.toml (PEP 621)
**决策**: 使用 `pyproject.toml` 管理依赖和工具配置。
**理由**: 这是 Python 社区目前推荐的标准方式，可统一管理 Ruff, MyPy, Pytest 等工具的配置。

### 3. 工具链：Ruff + MyPy + Pytest
**决策**: 选择 Ruff 进行格式化和 Linting。
**理由**: Ruff 命令极快，且集成了 Flake8, Black, Isort 的功能。MyPy 用于强制执行类型检查，减少运行时错误。

## Risks / Trade-offs

- **迁移风险**: 大规模的文件移动可能导致现有的 `venv` 路径或导入路径失效。
  - *对策*: 重新创建 venv 并通过 `pip install -e .` 以开发模式安装项目。
- **配置覆盖**: `.env` 文件处理逻辑的变化。
  - *对策*: 使用 `pydantic-settings` 统一管理，支持优先级覆盖。
