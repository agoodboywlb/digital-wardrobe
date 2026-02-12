---
description: Automated git commit following Conventional Commits standards
---

1. Check the current git status to see modified files.
   - Run: `git status`

2. Stage all changes (unless specific files are requested).
   - Run: `git add -A`

3. Analyze the changes to determine the commit type and scope.
   - Run: `git diff --staged`
   - Review the output to understand *what* changed and *why*.

4. Formulate a commit message following the Conventional Commits pattern: `type(scope): subject`.
   - **Types**:
     - `feat`: New feature
     - `fix`: Bug fix
     - `docs`: Documentation changes
     - `style`: Formatting, missing semi colons, etc; no code change
     - `refactor`: Refactoring production code
     - `perf`: Performance improvements
     - `test`: Adding tests, refactoring test; no production code change
     - `chore`: Updating build tasks, package manager configs, etc
   - **Scope**: The module or file complexity affected (e.g., `auth`, `wardrobe`, `utils`).
   - **Subject**: Brief description of the change (imperative mood).

5. Execute the commit.
   - Run: `git commit -m "type(scope): subject"`

6. Verify the commit status.
   - Run: `git log -1` to confirm.
