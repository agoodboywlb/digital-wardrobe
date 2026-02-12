---
description: Create a detailed, TDD-ready implementation plan.
---

Use when you have a validated design or requirements for a multi-step task, before touching code.

**Command**: `/superpowers:write-plan [design_doc]`

**Steps**

1.  **Announce Usage**
    Start by saying: "I'm using the `superpowers:write-plan` workflow to create the implementation plan."

2.  **Define Granularity**
    Each task must be a bite-sized action (2-5 minutes):
    - Write a failing test.
    - Verify failure.
    - Implement minimal code.
    - Verify pass.
    - Commit.

3.  **Structure the Plan**
    Save the plan to `docs/plans/YYYY-MM-DD-<feature-name>.md` using this structure:
    - **Header**: Feature Name, Goal, Architecture, Tech Stack.
    - **Tasks**: For each task, list:
        - Files to create/modify/test.
        - Steps (TDD flow).
        - Exact commands for verification.

4.  **TDD Focus**
    - Complete code snippets in the plan, not just descriptions.
    - Exact file paths and line ranges (if modifying).
    - DR, YAGNI, and frequent commits are mandatory.

5.  **Execution Handoff**
    After saving, offer two choices:
    1. **Subagent-Driven**: Fast iteration, fresh subagent per task.
    2. **Parallel Session**: Manual execution using `/superpowers:execute-plan`.

**Guardrails**
- No "placeholders" in the plan.
- Must include exact verification commands (e.g., `npm run test ...`).
- Ensure every change has a corresponding test step.
