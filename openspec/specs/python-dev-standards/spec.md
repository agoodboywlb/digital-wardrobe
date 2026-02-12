## ADDED Requirements

### Requirement: Standardized Dependency Management
项目必须使用 `pyproject.toml` 作为依赖和项目配置的单一事实来源（符合 PEP 621 规范），替代分散的 `requirements.txt`。

#### Scenario: Verify pyproject.toml existence
- **WHEN** 检查项目根目录
- **THEN** 必须存在 `pyproject.toml` 文件，包含项目元数据和依赖项

### Requirement: Modern Project Directory Structure
项目必须遵循结构化的模块化布局。`FastAPI` 应用、业务逻辑（services）、和核心配置（core）必须位于独立的包中。

#### Scenario: Validate package structure
- **WHEN** 运行指令 `ls` 检查目录
- **THEN** 应看到 `api/`, `services/`, `core/`, `models/` 等独立目录，且每个目录包含 `__init__.py`

### Requirement: Automated Code Quality Enforcement
项目必须配置 `ruff` 进行自动化的代码格式化和静态分析，并配置 `mypy` 进行类型检查。

#### Scenario: Run code quality tools
- **WHEN** 执行 `ruff check .` 和 `mypy .`
- **THEN** 工具应能正确运行并报告代码质量问题或通过检查

### Requirement: Test-Driven Development (TDD) Framework
项目必须使用 `pytest` 作为测试框架，且所有核心业务逻辑（尤其是 AI 搭配生成的 ID 映射逻辑）必须有对应的单元测试。

#### Scenario: Execute tests
- **WHEN** 运行 `pytest`
- **THEN** 测试引擎应能发现并执行 `tests/` 目录下的所有测试用例
