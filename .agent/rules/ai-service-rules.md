---
trigger: model_decision
description: when developing AI service or backend python project
---

# AI Service Project Rules

> Project Type: AI-driven Outfit Recommendation Service
> Tech Stack: Python 3.14 / FastAPI / Google GenAI (Gemini 3 Flash)

---

## Tech Stack

- **Framework**: FastAPI
- **LLM SDK**: Google GenAI
- **Validation**: Pydantic v2
- **Config**: Pydantic Settings
- **Testing**: Pytest

---

## Core Directory Structure

```text
app/
├── api/          # Routes, HTTP status conversion
├── core/         # Config (Settings), Logging
├── models/       # Pydantic Models (DTO)
└── services/     # Core logic, LLM interaction
```

---

## Naming Conventions

| Type | Format | Example |
|------|------|------|
| Class | PascalCase | `OutfitService` |
| Function/Var | snake_case | `generate_outfit` |
| Constant | UPPER_SNAKE | `DEFAULT_MODEL` |
| File | snake_case | `outfit_service.py` |

---

## Coding Standards

- **Type Hints**: All function signatures MUST have explicit input and return types.
- **Static Check**: MUST pass `ruff check` and `mypy --strict`.
- **Service Pattern**: Use Class encapsulation.

```python
class OutfitService:
    def generate_outfit(self, request: OutfitRequest) -> OutfitResponse: ...

outfit_service = OutfitService()
```

---

## LLM Integration

- **Config Driven**: API Key, Model Name MUST come from `core/config.py`.
- **ID Mapping**: LLM returned IDs MUST be validated against input.
- **Robust Parsing**: MUST handle non-standard JSON output (Regex + Exception handling).

---

## Error Handling & Logging

- **Global Exception**: `api` layer handles exceptions via FastAPI Exception Handler.
- **Logging**: Use `logging.getLogger(__name__)`.
