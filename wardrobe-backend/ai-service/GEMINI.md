# AI Service 项目规范

> 项目类型: AI 驱动的智能穿搭推荐服务  
> 技术栈: Python 3.10+ / FastAPI / Google GenAI (Gemini 3 Flash)

---

## 技术栈

- **Framework**: FastAPI
- **LLM SDK**: Google GenAI
- **Validation**: Pydantic v2
- **Config**: Pydantic Settings
- **Testing**: Pytest

---

## 核心目录结构

```text
ai_service/
├── api/          # 路由定义、HTTP 状态码转换
├── core/         # 配置中心 (Settings)、日志
├── models/       # Pydantic 数据模型 (DTO)
└── services/     # 核心业务逻辑、LLM 交互
```

---

## 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 类 | PascalCase | `OutfitService` |
| 函数/变量 | snake_case | `generate_outfit` |
| 常量 | UPPER_SNAKE | `DEFAULT_MODEL` |
| 文件 | snake_case | `outfit_service.py` |

---

## 编码规范

- **类型注解**: 所有函数签名必须包含显式的输入和返回类型
- **静态检查**: 必须通过 `ruff check` 和 `mypy --strict`
- **Service 模式**: 使用 Class 封装业务逻辑

```python
class OutfitService:
    def generate_outfit(self, request: OutfitRequest) -> OutfitResponse: ...

outfit_service = OutfitService()
```

---

## LLM 集成规范

- **配置驱动**: API Key、Model Name 必须从 `core/config.py` 的 `settings` 获取
- **ID 映射保护**: LLM 返回的资源标识必须经过校验函数，防止幻觉产生无效 UUID
- **鲁棒解析**: 必须处理 LLM 输出的非标准 JSON（正则提取 + 异常兜底）

---

## 错误处理与日志

- **全局异常**: `api` 层通过 FastAPI Exception Handler 统一拦截
- **日志规范**: 使用 `logging.getLogger(__name__)`，关键节点必须记录上下文

---

## 开发命令

```bash
source venv/bin/activate   # 激活虚拟环境
python main.py             # 启动服务
pytest                     # 运行测试
ruff check . && ruff format .  # 代码检查与格式化
mypy .                     # 类型检查
```
