# AI Service Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 `ai-service` 从单文件结构重构为模块化架构，并引入现代 Python 工程化工具链。

**Architecture:** 采用渐进式拆分策略（Option A），首先建立包结构和核心配置，分步迁移业务逻辑并进行 TDD 验证，最后简化 API 入口。

**Tech Stack:** FastAPI, Pydantic v2, Google GenAI, Ruff, MyPy, Pytest, Pydantic-Settings.

---

## 1. 工程化环境初始化

### Task 1.1: 创建 pyproject.toml [x]
**Files:**
- Create: `wardrobe-backend/ai-service/pyproject.toml`

**Steps:**
- 创建符合 PEP 621 的配置文件，集成 Ruff 和 MyPy 配置。
- `git add pyproject.toml && git commit -m "chore: add pyproject.toml with tool configurations"`

### Task 1.2: 建立目录结构 [x]
**Files:**
- Create: `wardrobe-backend/ai-service/ai_service/__init__.py`
- Create: `wardrobe-backend/ai-service/ai_service/api/__init__.py`
- Create: `wardrobe-backend/ai-service/ai_service/services/__init__.py`
- Create: `wardrobe-backend/ai-service/ai_service/core/__init__.py`
- Create: `wardrobe-backend/ai-service/ai_service/models/__init__.py`
- Create: `wardrobe-backend/ai-service/tests/__init__.py`

**Steps:**
- 使用 `mkdir -p` 和 `touch` 创建包结构。
- `git add ai_service tests && git commit -m "chore: initialize modular directory structure"`

## 2. 核心基础设施迁移

### Task 2.1: 迁移配置管理 [x]
**Files:**
- Create: `wardrobe-backend/ai-service/ai_service/core/config.py`

**Steps:**
- 使用 `pydantic-settings` 定义 `Settings` 类。
- `git add ai_service/core/config.py && git commit -m "refactor: migrate configuration to pydantic-settings"`

### Task 2.2: 定义数据模型 [x]
**Files:**
- Create: `wardrobe-backend/ai-service/ai_service/models/outfit.py`

**Steps:**
- 从 `main.py` 迁移 `ClothingItem`, `OutfitRequest`, `OutfitResponse` 模型。
- `git add ai_service/models/outfit.py && git commit -m "refactor: migrate data models"`

## 3. 业务逻辑 TDD 迁移

### Task 3.1: 编写 OutfitService 单元测试 [x]
**Files:**
- Create: `wardrobe-backend/ai-service/tests/test_outfit_service.py`

**Steps:**
- 针对 ID 映射和修正逻辑编写失败的测试用例（Failing Test）。
- 运行 `pytest tests/test_outfit_service.py` 验证失败。
- `git add tests/test_outfit_service.py && git commit -m "test: add failing tests for OutfitService"`

### Task 3.2: 实现 OutfitService [x]
**Files:**
- Create: `wardrobe-backend/ai-service/ai_service/services/outfit_service.py`

**Steps:**
- 实现业务逻辑，使其通过 Task 3.1 的测试。
- 运行 `pytest` 验证 PASS。
- `git add ai_service/services/outfit_service.py && git commit -m "feat: implement modular OutfitService"`

## 4. API 与 入口重构

### Task 4.1: 创建模块化路由 [x]
**Files:**
- Create: `wardrobe-backend/ai-service/ai_service/api/routes.py`

**Steps:**
- 定义 `APIRouter`，将路由逻辑从 `main.py` 迁移出来并注入 Service。
- `git add ai_service/api/routes.py && git commit -m "refactor: migrate FastAPI routes"`

### Task 4.2: 简化 main.py 与 入口联调 [x]
**Files:**
- Modify: `wardrobe-backend/ai-service/main.py`

**Steps:**
- 清空 `main.py` 冗余逻辑，仅保留应用生命周期和路由挂载。
- 验证服务运行正常。
- `git add main.py && git commit -m "refactor: simplify main.py entry point"`

## 5. 清理与规范检查

### Task 5.1: 运行工具链联调
**Steps:**
- 命令: `ruff check .`
- 命令: `mypy .`
- 命令: `pytest`
- 修复所有检测到的规范问题。
- `git commit -m "style: apply ruff and mypy fixes"`

### Task 5.2: 删除旧文件
**Steps:**
- 命令: `rm requirements.txt test3.py`
- `git add . && git commit -m "cleanup: remove obsolete files"`
