<!-- Record knowledge and decisions during implementation. Write entries during work, not after.
Each entry uses a structured format for future search and retrieval.

Guidelines:
- Write in plain language, not formal prose
- Focus on WHY, not WHAT — the code shows what changed
- Only record noteworthy events — if the plan was followed exactly, there is nothing to log
- One entry per meaningful event — do not log routine changes
-->

## Entries

<!-- Each entry must use this structured format:

### [Short actionable title]
- **tags**: [comma-separated domain keywords for search]
- **scope**: [global | project:<name>]
- **context**: [What was being worked on]
- **insight**: [The decision, discovery, or deviation — focus on WHY]

Example:

### Switched from LIKE queries to tsvector for product search
- **tags**: postgresql, search, performance, indexing
- **scope**: project:catalog
- **context**: Implementing the search endpoint (Task 2 in plan). Initial ILIKE approach showed 650ms response on 100K rows.
- **insight**: LIKE with leading wildcard forces sequential scans. tsvector + GIN index provides O(log n) lookup, bringing response time from 650ms to 12ms. Always use tsvector for full-text search at scale.

---

### Input validation prevents DoS via long search queries
- **tags**: security, validation, performance
- **scope**: global
- **context**: Testing edge cases on the search endpoint. 10,000-char query caused 3s parse time.
- **insight**: Unbounded input length is both a performance risk and a DoS vector. Added 1-200 char validation returning HTTP 400. Always validate input length for text-processing endpoints.
-->

## Deviations from Plan

<!-- Summarize significant differences between the plan and what was actually implemented. Fill this in at the end by pulling from entries above.

Format:
| Planned | Actual | Reason |
| ------- | ------ | ------ |
| [Original approach] | [What was done instead] | [Why the change] |
-->
