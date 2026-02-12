---
trigger: model_decision
description: when committing code, handling branches, creating pull requests, or following git workflow
---

# Git Workflow

## Conventional Commits

Follow the Conventional Commits specification: `type(scope): subject`

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semi colons, etc; no code change
- `refactor`: Refactoring production code
- `perf`: Performance improvements
- `test`: Adding tests, refactoring test; no production code change
- `chore`: Updating build tasks, package manager configs, etc

### Examples
- `feat(auth): add login page`
- `fix(wardrobe): fix image upload timeout`

## Branching Strategy

- `main`: Production-ready code.
- `feature/*`: New features (e.g., `feature/login`).
- `fix/*`: Bug fixes (e.g., `fix/upload-error`).

## Pull Requests

- **Description**: Explain *what* changed and *why*.
- **Checklist**:
  - [ ] Lint passed
  - [ ] Tests passed
  - [ ] Documentation updated