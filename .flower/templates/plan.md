---
status: [draft | in-progress | completed]
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

A well-formed task has:
- A clear, imperative description of WHAT to do
- A "Done when" block listing concrete, testable conditions
- Optionally, "Approach" when the implementation path is non-obvious — skip for straightforward tasks
- Optionally, "Blocked by" if it depends on another task completing first

Guidelines:
- One logical change per task — if the description says "X and Y", split into two tasks
- Order tasks by dependency — tasks that unblock others come first
- Use precise verbs: implement, add, remove, migrate, validate — not "handle", "deal with", "look into"
- Done conditions must be specific enough to verify programmatically. Bad: "works correctly". Good: "GET /api/products/search?q=mouse returns HTTP 200 with matching products"
-->

### [Group Name]

- [ ] **Task 1**: [Description]
  - Done when:
    - [Concrete testable condition]
    - [Concrete testable condition]

- [ ] **Task 2**: [Description]
  - Approach: [How to implement — only when non-obvious]
  - Blocked by: Task 1
  - Done when:
    - [Concrete testable condition]

### [Group Name]

- [ ] **Task 3**: [Description]
  - Done when:
    - [Concrete testable condition]

## 4. Dependencies

<!-- List anything that must exist or be available BEFORE implementation can begin. Skip items already in place. -->

### Internal Dependencies

<!-- Code, modules, or infrastructure within the project that tasks depend on — only if NOT already listed as a task above. If it is, use "Blocked by" on the task instead. -->

### External Dependencies

<!-- Third-party services, APIs, packages, credentials, or infrastructure outside the project's control. Example: "PostgreSQL 15+ with full-text search support", "API gateway configured to allow the new endpoint". -->

## 5. Risks & Mitigation

<!-- Identify what could go wrong during implementation and how to handle it. Focus on risks that would change the plan if they materialize. Skip generic risks like "bugs might occur".

Format:
- **Risk**: [What could go wrong]
  - Impact: [What happens if it does]
  - Mitigation: [How to prevent or respond]
-->
