---
status: [in-progress | completed | rejected]
---

## 1. Overview

<!-- Write 2-3 sentences stating what is being built and the general approach. Scope and direction must be clear from this section alone.

Example: "Add full-text search to the product catalog API using PostgreSQL tsvector. A new search endpoint accepts keyword queries and returns products ranked by relevance. A GIN index on a generated tsvector column ensures response times stay under 200ms." -->

## 2. Technical Decisions

<!-- List decisions that affect multiple tasks. State WHAT was decided and WHY. Only include decisions where the choice is non-obvious or where choosing differently would significantly change the plan.

Format (simple — use when the choice is clear):
- **[Decision]**: [Rationale]

Format (complex — use when alternatives were seriously considered):
- **[Decision]**: [Rationale]
  - Alternatives considered: [Rejected option → why rejected]
  - Tradeoff: [What is given up]

Example:
- **PostgreSQL tsvector instead of Elasticsearch**: Avoids new infrastructure dependency; tsvector is sufficient for catalogs under 500K items and keeps the stack simple.
  - Alternatives considered: Elasticsearch → requires new cluster, adds ops complexity not needed at current scale
  - Tradeoff: No built-in typo tolerance or synonym expansion
- **GIN index on a generated tsvector column**: Keeps the index in sync automatically when product data changes, no application-level trigger logic needed.

Skip this section if all technical choices are obvious or only affect a single task. -->

## 3. Tasks

<!-- Break down the work into concrete, ordered tasks. Group related tasks under a heading when it aids readability.

Each task MUST have:
- A clear, imperative description of WHAT to do
- **AC**: Acceptance criteria specific to this task — pass/fail verifiable
- **Approach**: How to implement — concrete steps, files to touch, patterns to follow
- Optionally, **Blocked by** if it depends on another task completing first

Guidelines:
- One logical change per task — if the description says "X and Y", split into two tasks
- Order tasks by dependency — tasks that unblock others come first
- Use precise verbs: implement, add, remove, migrate, validate — not "handle", "deal with", "look into"
- AC must be specific enough to verify programmatically. Bad: "works correctly". Good: "GET /api/products/search?q=mouse returns HTTP 200 with matching products"
-->

### [Group Name]

- [ ] **Task 1**: [Description]
  - AC:
    - [Concrete testable condition]
    - [Concrete testable condition]
  - Approach: [How to implement — concrete steps, files to touch, patterns to follow]

- [ ] **Task 2**: [Description]
  - AC:
    - [Concrete testable condition]
  - Approach: [How to implement]
  - Blocked by: Task 1

### [Group Name]

- [ ] **Task 3**: [Description]
  - AC:
    - [Concrete testable condition]
  - Approach: [How to implement]

## 4. Dependencies

<!-- List anything that must exist or be available BEFORE implementation can begin. Skip items already in place. Skip section entirely if no dependencies exist. -->

### Internal Dependencies

<!-- Code, modules, or infrastructure within the project that tasks depend on — only if NOT already listed as a task above. If it is, use "Blocked by" on the task instead. -->

### External Dependencies

<!-- Third-party services, APIs, packages, credentials, or infrastructure outside the project's control. Example: "PostgreSQL 15+ with full-text search support", "API gateway configured to allow the new endpoint". -->

## 5. Risks & Mitigation

<!-- Identify what could go wrong during implementation and how to handle it. Focus on risks that would change the plan if they materialize. Skip generic risks like "bugs might occur". Skip section entirely if no meaningful risks exist.

Format:
- **Risk**: [What could go wrong]
  - Impact: [What happens if it does]
  - Mitigation: [How to prevent or respond]
-->

## Rejection Reason

<!-- Only fill this section if status is "rejected". Explain why the requirement is not feasible — cite specific constraints, technical limitations, or contradictions that make it unachievable. Delete this section if the plan is feasible. -->
