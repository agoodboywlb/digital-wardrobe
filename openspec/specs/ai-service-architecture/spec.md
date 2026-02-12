## ADDED Requirements

### Requirement: Service Layer Abstraction
AI 处理逻辑必须从 FastAPI 路由处理器中提取到独立的 Service 类中（例如 `OutfitService`），以实现逻辑与传输层的解耦。

#### Scenario: Verify service injection
- **WHEN** 查看 `api/routes.py`
- **THEN** 路由处理器应调用 `services/` 中的方法，而非直接调用 LLM 客户端

### Requirement: Robust ID Mapping Mechanism
系统必须实现鲁棒的 ID 映射检查，确保 LLM 返回的单品 ID 能够正确映射回原始请求中的 UUID。

#### Scenario: Validate LLM output correction
- **WHEN** LLM 返回非 UUID 格式或不存在的名称时
- **THEN** Service 层必须能够通过名称映射表尝试修正，或丢弃无效 ID，确保返回给前端的 ID 始终合法

### Requirement: Centralized Configuration Management
所有的环境变量（如 `GEMINI_API_KEY`）和系统常量必须通过 Pydantic Settings 或类似的统一配置模块管理。

#### Scenario: Load configuration
- **WHEN** 系统启动时
- **THEN** 应从 `core/config.py` 中读取所有配置，严禁在业务逻辑中直接使用 `os.getenv`
