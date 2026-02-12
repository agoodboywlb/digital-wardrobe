---
trigger: model_decision
description: when working wardrobe-front styling or UI coding
---

# UI & Styling Guidelines

## CSS Architecture

- **Global Variables**: Use CSS variables for colors, spacing, typography, and shadows.
- **Dark Mode**: Support dark mode via `prefers-color-scheme` using CSS variables.
- **Reset**: Use a standard normalize/reset CSS.

## Styling Approaches

- **CSS Modules**: Preferred for component-specific styles to avoid class name collisions.
- **Tailwind CSS**: Acceptable if the project has adopted it. Use utility classes for layout and spacing.

## Component Styling

- **Separation**: Keep structure (TSX) and style (CSS) separate or clearly defined.
- **Dynamic Styles**: Use class names for dynamic states (e.g., `.active`) rather than inline styles, unless the value is truly dynamic (e.g., coordinates).

### Directory Structure
```
components/
  Button/
    Button.tsx
    Button.module.css
```