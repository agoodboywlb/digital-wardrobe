## 1. 工程化与工具链配置

- [x] 1.1 创建 `pyproject.toml` 并配置项目元数据、依赖项、Ruff、MyPy 和 Pytest 配置
- [x] 1.2 创建标准的 Python 包目录结构：`ai_service/api`, `ai_service/services`, `ai_service/core`, `ai_service/models`, `tests`
- [x] 1.3 初始化各目录的 `__init__.py` 文件

## 2. 核心模块重构

- [x] 2.1 迁移配置逻辑：在 `core/config.py` 中使用 Pydantic Settings 实现配置管理
- [x] 2.2 迁移数据模型：在 `models/outfit.py` 中定义 `ClothingItem`, `OutfitRequest`, `OutfitResponse`
- [x] 2.3 提取业务服务：在 `services/outfit_service.py` 中实现 `OutfitService` 及其 ID 修正逻辑
- [x] 2.4 抽取 API 路由：在 `api/routes.py` 中定义 FastAPI 路由处理器

## 3. 测试与验证

- [x] 3.1 编写单元测试：在 `tests/test_outfit_service.py` 中验证 ID 映射修正逻辑
- [x] 3.2 整合应用：更新 `main.py` 为简单的应用生命周期管理和 entry-point
- [x] 3.3 运行工程化联调：执行 `ruff check .`, `mypy .` 和 `pytest` 确保所有检查通过
- [x] 3.4 清理冗余代码：删除旧的 `requirements.txt` 和不再使用的临时脚本（如 `test3.py`）
