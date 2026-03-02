---
status: [draft | completed]
---

## 1. Summary

<!-- Write 2-4 sentences stating what was delivered and the overall outcome. This must be self-contained — do not assume prior context.

Example: "Added full-text search to the product catalog API using PostgreSQL tsvector. Shoppers can now search products by name, description, and tags with relevance-ranked results. All acceptance criteria passed. Response time is under 150ms at p95." -->

## 2. Quality Checklist

<!-- Complete each item. If skipping any, note the reason.

- [ ] Dead code & unused files removed
- [ ] Project standards followed (style, structure, patterns, linting)
- [ ] No security issues (secrets, injection, auth bypass, etc.)
- [ ] Performance acceptable (no N+1, unnecessary re-renders, large payloads, etc.)
- [ ] All tests pass
- [ ] Documentation up to date (skip if no user-facing docs exist)
-->

## 3. Memories

<!-- Record knowledge gained during this quest for future retrieval.

Each entry:
- **title**: Short, actionable (5-12 words)
- **content**: Detailed explanation with context and examples
- **tags**: Comma-separated domain keywords
- **scope**: global | project:<name>

### [Title]
- **content**: [Detailed explanation]
- **tags**: [e.g., search, backend, postgresql]
- **scope**: [e.g., global, project:catalog]

Example:

### PostgreSQL tsvector requires GIN index for acceptable performance
- **content**: Without a GIN index on the tsvector column, full-text search queries degrade to sequential scans. On a 100K row table, query time dropped from 800ms to 12ms after adding the index. Always create a GIN index when using tsvector.
- **tags**: postgresql, search, performance, indexing
- **scope**: project:catalog

### Test search relevance with real-world data, not synthetic data
- **content**: Initial tests with synthetic data all passed, but real product names with typos and abbreviations exposed ranking issues. Always use a representative sample of production data for search quality tests.
- **tags**: testing, search, data-quality
- **scope**: global
-->
