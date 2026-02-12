---
trigger: model_decision
description: when working on database schema changes, migrations, or supabase integration in wardrobe-front
---

# Supabase Workflow

> **Principle**: `migrations` is the Single Source of Truth. Never edit applied migrations.

## 🛠️ Commands

| Command | Usage |
| :--- | :--- |
| `npm run db:pull` | **Sync Remote → Local**. Pull remote changes to local migrations. |
| `npm run db:push` | **Apply Local → Remote**. Push local migrations to remote DB. |
| `npm run db:gen:types` | **Update TS Types**. Regenerate `database.ts` after ANY schema change. |

## 🔄 Process

### A. Sync Remote Changes (Dashboard → Local)
1. `npm run db:pull`
2. `npm run db:gen:types`

### B. New Feature Dev (Local → Remote)
1. `supabase migration new <name>` (e.g. `add_orders`)
2. Edit generated SQL file in `supabase/migrations/`
3. `npm run db:push`
4. `npm run db:gen:types`

## ⚠️ Checklist
- [ ] **RLS**: New tables must have Row Level Security enabled.
- [ ] **Immutable**: Never modify existing/applied migration files.
- [ ] **Type Check**: Fix frontend type errors after regenerating types.
