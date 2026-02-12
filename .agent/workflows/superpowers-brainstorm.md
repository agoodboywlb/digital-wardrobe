---
description: Explore user intent, requirements, and design before implementation.
---

You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior.

**Command**: `/superpowers:brainstorm [topic]`

**Steps**

1.  **Check Project State**
    Before asking questions, prioritize the materials **provided by the user**. Then, briefly check the current state as defined in the skill:
    - **Files**: Relevant source files mentioned by the user or recently modified.
    - **Docs**: Project manifest (`GEMINI.md`) and standard guidelines.
    - **Recent Commits**: The last few commits to understand the current trajectory.

2.  **Collaborative Refinement**
    - **Wait/Ask**: If the user hasn't provided specific reference documents, ask for them.
    - Ask questions **one at a time** to refine the idea.
    - Prefer multiple-choice questions when possible.
    - Focus on: **Purpose**, **Constraints**, and **Success Criteria**.

3.  **Propose Approaches**
    - Propose **2-3 different approaches** with trade-offs.
    - Lead with a recommended option and explain why (using YAGNI principles).

4.  **Present Design Incrementally**
    - Present the design in small sections (200-300 words).
    - Ask for feedback after each section.
    - Cover: Architecture, Component interaction, Data flow, and Testing strategy.

5.  **Documentation & Handoff**
    - Write the final design to `docs/plans/YYYY-MM-DD-<topic>-design.md`.
    - Commit it to git.
    - Ask: "Ready to set up for implementation?" (Suggesting `/superpowers:write-plan`).

**Guardrails**
- Only one question per message.
- Do not touch code until the design is validated.
- Ruthlessly apply YAGNI (You Ain't Gonna Need It).
