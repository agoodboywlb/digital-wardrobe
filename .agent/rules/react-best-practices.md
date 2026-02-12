---
trigger: model_decision
description: when working on React components, hooks, state management, or performance in wardrobe-front
---

# React Best Practices

## Component Structure

- **Functional Components**: Use functional components with Hooks.
- **PascalCase**: Component filenames and function names should be PascalCase.
- **One Component Per File**: Unless components are tightly coupled and small.

### Props Design
- Define explicit interfaces for Props.
- Use default values for optional props.
  ```typescript
  interface ButtonProps {
    variant?: 'primary' | 'secondary';
    onClick: () => void;
  }
  
  export const Button: React.FC<ButtonProps> = ({ variant = 'primary', onClick }) => { ... }
  ```

## State Management

### Local State
- Use `useState` for simple UI state (toggles, inputs).
- Use `useReducer` for complex state logic or related state transitions.

### Global State
- Avoid excessive global state. Use Context for theme/auth.
- Prefer server state management (like React Query or SWR pattern) for data fetching over global client state stores where possible.

## Performance

- **Memoization**:
  - Use `useMemo` for expensive calculations.
  - Use `useCallback` for functions passed as props to memoized child components.
- **Code Splitting**:
  - Use `React.lazy` and `Suspense` for route-level splitting.
  - Lazy load heavy components or third-party libraries.

## Hooks
- **Rules of Hooks**: Only call hooks at the top level of functional components or custom hooks.
- **Naming**: Custom hooks must start with `use`.
- **Custom Hooks**: Extract reusable logic into custom hooks (e.g., `useWardrobe`, `useAuth`).