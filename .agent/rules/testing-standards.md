---
trigger: model_decision
description: when working wardrobe-front testing
---

# Testing Standards

## Testing Stack
- **Unit/Integration**: Vitest
- **Component Testing**: React Testing Library

## Strategy

### Unit Tests
- **Focus**: Pure functions, utility logic, hooks, and complex algorithmic logic.
- **File**: `*.test.ts` alongside the source file.

### Component Tests
- **Focus**: Rendering, user interaction, and accessibility.
- **Mocking**: Mock network requests and complex child components if necessary.
- **File**: `*.test.tsx` alongside the component.

### Integration Tests
- **Focus**: Critical user flows (e.g., "User can browse wardrobe").
- **Mocking**: Mock external API calls but keep internal wiring intact.

## Best Practices
- **Arrange-Act-Assert**: Follow the AAA pattern.
- **Resilient Selectors**: Use `getByRole`, `getByLabelText`, `getByText` (user-facing attributes) instead of CSS selectors `querySelector`.
- **Coverage**: Aim for high coverage on core business logic and critical paths.