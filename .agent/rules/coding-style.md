---
trigger: model_decision
description: when checking naming conventions, code formatting, or comment standards in wardrobe-front
---

# Coding Style Guidelines

## Naming Conventions

### File Naming
- **Components**: `PascalCase` (e.g., `UserProfile.tsx`)
- **Utilities/Services/Hooks**: `camelCase` (e.g., `formatDate.ts`, `useAuth.ts`)
- **Types/Interfaces**: `PascalCase` (e.g., `ClothingItem.ts`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_ENDPOINTS.ts`)

### Variable Naming
- Use descriptive names: `userName`, `isLoading`
- Avoid single letters or vague names: `x`, `flag`, `data` (unless generic)

### Function Naming
- Verb-first: `fetchUserData`, `handleSubmit`, `validateEmail`

## Formatting
- Use Prettier with the project configuration:
  ```json
  {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "printWidth": 100,
    "arrowParens": "always"
  }
  ```

## Comments
- Use JSDoc for public APIs and complex functions.
- Explain "Why", not "What".
- **Bad**: `// Set loading to true`
- **Good**: `// Prevent duplicate API calls while fetching`

### JSDoc Example
```typescript
/**
 * Fetches user wardrobe items.
 * @param userId - The user's ID
 * @param options - Fetch options
 * @returns List of clothing items
 * @throws {ApiError} If the API call fails
 */
async function fetchItems(userId: string, options?: FetchOptions): Promise<Item[]> { ... }
```