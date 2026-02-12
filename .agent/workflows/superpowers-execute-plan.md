---
description: Execute a written plan in batches with review checkpoints.
---

Use when you have a written implementation plan and are ready to execute it.

**Command**: `/superpowers:execute-plan [plan_doc]`

**Steps**

1.  **Load & Review**
    - Read the plan file.
    - review critically: identify gaps, missing dependencies, or unclear instructions.
    - Raise concerns immediately before starting.

2.  **Announce Implementation**
    Start by saying: "I'm using the `superpowers:execute-plan` workflow to implement this plan."

3.  **Execute in Batches**
    - **Default batch size**: 3 tasks.
    - For each task:
        1. Mark as `in_progress` in the plan file.
        2. Follow every step (TDD flow) exactly as written.
        3. Run verifications and capture output.
        4. Mark as `completed`.

4.  **Checkpoint Report**
    When the batch is done:
    - Show what was implemented.
    - Show verification results (tests passed).
    - Say: "Ready for feedback." and wait.

5.  **Completion**
    - Once all tasks are done, run final full-suite verification.
    - Suggest using a "finishing" workflow to clean up and present the work.

**Guardrails**
- STOP executing if a verification fails or a blocker is hit.
- NEVER start execution on `main`/`master` without explicit user permission.
- Follow the plan steps exactly; don't deviate without consulting the user.
