---
trigger: model_decision
description: when needing overview of wardrobe-front project architecture, directory structure, or general frontend rules
---

# Digital Wardrobe: Frontend Project Rules

> **Scope**: `wardrobe-front` project specific architecture and business rules.
> **Tech Stack**: React 19, TypeScript 5.8, Vite 6, Supabase.

---

## 📚 Coding Standards

For detailed coding standards, please refer to the specific rule files:
- **[Coding Style](./coding-style.md)**: Naming conventions, formatting, comments.
- **[TypeScript](./typescript-best-practices.md)**: Type definitions, strict mode.
- **[React](./react-best-practices.md)**: Component structure, hooks, state.
- **[UI & Styling](./ui-styling.md)**: CSS architecture, component styling.

---

## 🏗️ Core Directory Structure

```
src/
├── components/      # Common components (common/, layout/)
├── features/        # Feature modules (wardrobe/, outfit/, stats/)
│   └── [feature]/   # Feature-based Architecture
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── hooks/           # Global Hooks
├── lib/             # Third-party lib config (supabase.ts)
├── pages/           # Page components (Route level)
├── services/        # Global services (Auth, etc.)
├── styles/          # Global styles (Variables, Reset)
├── types/           # Global types (Entities, API)
└── utils/           # Utility functions
```

---

## 🔐 Data Permissions & Isolation

1.  **Auth Guard**: Use `ProtectedRoute` component to intercept business routes.
2.  **Multi-tenant Isolation**: Service layer MUST use `BaseService.getCurrentUserId()` to get current user ID:
    -   **Query**: MUST explicitly add `.eq('user_id', userId)`.
    -   **Write**: Automatically inject `user_id` on insert; validate `user_id` on update/delete.
3.  **Database Constraints**: Core business tables (`items`, `outfits`, etc.) `user_id` field MUST be `NOT NULL`.

---

## 🖼️ Image Processing & Optimization

1.  **Upload Pre-processing**: All images MUST be processed by `getCroppedImg` before upload:
    -   **Format**: `image/webp`
    -   **Size**: Max width `1200px`
    -   **Quality**: `0.8`
2.  **Loading Optimization**: Use `OptimizedImage` component with `Cache API` support.

---

## 🤖 AI Assistant Specs

1.  **Architecture**: Independent Feature module (`src/features/assistant`).
2.  **Integration**:
    -   **Endpoint**: `POST /generate-outfit`
    -   **Env**: `VITE_AI_SERVICE_URL`
    -   **Fallback**: Rule engine if AI fails.
3.  **Rule Engine (Fallback)**:
    -   **Base**: 1 Top + 1 Bottom
    -   **Temp < 15°C**: Add `outerwear`
    -   **Temp > 28°C**: No heavy materials (wool, etc.)

---

## 🔗 References

-   [Global Project Standards](../../docs/PROJECT_STANDARDS.md)
