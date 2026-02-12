---
trigger: model_decision
description: when writing TypeScript code, defining types, or fixing type errors in wardrobe-front
---

# TypeScript Best Practices

## Type Definitions

### Interface vs Type
- **Interfaces**: Use for object structures, especially those that might be extended.
  ```typescript
  interface ClothingItem {
    id: string;
    name: string;
  }
  ```
- **Types**: Use for unions, intersections, primitives, tuples, or complex utility types.
  ```typescript
  type Category = 'tops' | 'bottoms';
  type Nullable<T> = T | null;
  ```
- **Enums**: Use for fixed sets of related constants.
  ```typescript
  enum ItemStatus {
    InWardrobe = 'in_wardrobe',
    ToWash = 'to_wash',
  }
  ```

## Strict Mode
- Maintain `strict: true` in `tsconfig.json`.
- **No Implicit Any**: All variables and functions arguments must have types.
- **Strict Null Checks**: Handle `null` and `undefined` explicitly.

## Type Safety Tips

### Avoid `any`
- Use `unknown` if the type is truly not known yet, and narrow it down.
- **Bad**: `function process(data: any) { ... }`
- **Good**: `function process(data: unknown) { if (isString(data)) ... }`

### Type Guards
- Use user-defined type guards to validate runtime data.
  ```typescript
  function isClothingItem(item: unknown): item is ClothingItem {
    return typeof item === 'object' && item !== null && 'id' in item;
  }
  ```