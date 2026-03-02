<!-- Record what actually happens during implementation. Write entries during work, not after. Each entry captures a decision, discovery, or deviation relevant for understanding the code later.

Guidelines:
- Write in plain language, not formal prose
- Focus on WHY, not WHAT — the code shows what changed
- Only record deviations from the plan — if the plan was followed exactly, there is nothing to log
- Include links to relevant commits, PRs, or issues when useful
- One entry per meaningful event — do not log routine changes

An entry has:
- **Date** and a short title
- **Context**: what was being worked on
- **What happened**: the decision, problem, or change
- **Why**: reasoning behind it
- Optionally: code snippets, error messages, performance numbers, links
-->

## Entries

### [YYYY-MM-DD] [Short title]

<!-- Example:

### 2024-01-16 — Switched from LIKE queries to tsvector for product search

**Context:** Implementing the search endpoint (Task 2 in plan).

**What happened:** Initial implementation used `ILIKE '%keyword%'` for simplicity. Benchmarking with 100K products showed 650ms average response time — far above the 200ms target. Switched to PostgreSQL tsvector with a GIN index, which brought response time to 12ms.

**Decision:** Use tsvector with a generated column and GIN index instead of LIKE queries.

**Why:** LIKE with leading wildcard cannot use btree indexes and forces sequential scans. tsvector + GIN index provides O(log n) lookup. The 50x improvement justifies the slightly more complex migration.

**Impact on plan:** No new tasks needed. Task 2 approach changed but scope stayed the same.

---

### 2024-01-17 — Added search query length validation

**Context:** Testing edge cases on the search endpoint.

**What happened:** Submitting a 10,000-character search query caused PostgreSQL to spend 3 seconds parsing the tsquery. Added validation: minimum 1 character, maximum 200 characters.

**Fix:** Added input validation middleware that returns HTTP 400 for queries outside the 1-200 character range.

**Why:** Unbounded input length is both a performance risk and a potential DoS vector. 200 characters is generous for any realistic product search.

---

### 2024-01-18 — Dropped search result highlighting from scope

**Context:** Building response serialization for search results.

**What happened:** Plan included returning highlighted snippets showing where the search term matched. After implementing, realized the frontend doesn't use the snippets — it just shows the full product description. The highlighting logic added complexity to the query (ts_headline) and increased response time by 40ms.

**Decision:** Removed highlighting from the response. Return plain product data only.

**Why:** YAGNI. If the frontend needs highlighting later, it can be added as an enhancement. Current flow returns results fast and the frontend handles display.

**Impact on plan:** Simplified Task 3 (response formatting). No tasks added or removed.
-->

## Deviations from Plan

<!-- Summarize significant differences between the plan and what was actually implemented. Fill this in at the end by pulling from entries above. This provides a quick diff between intended and actual implementation.

Format:
| Planned | Actual | Reason |
| ------- | ------ | ------ |
| LIKE queries for search | tsvector + GIN index | LIKE too slow for 100K rows |
| Search result highlighting | Dropped | Frontend doesn't use it, adds 40ms |
-->
