---
name: flower-review
description: Review code quality, security, and cross-cutting concerns file-by-file. Check DRY, YAGNI, KISS principles, security vulnerabilities, and project conventions. Triggers on 'review', 'code review', 'security review', 'check code'.
---

Review code quality and security after verification.

## Core Principle

This phase is **review and documentation only**. Identify issues, do not fix them.

### Do

- Read and analyze all documents and code
- Search codebase for patterns
- Create and update `review.md`

### Do Not

- Modify implementation code
- Fix issues (document them instead)
- Make file changes (except `review.md`)

---

## Step 1: Get Task Path

Check user input for path, folder name, or partial match. Construct full path `.agents/flower/{folder-name}` and verify files exist. If not found, ask user.

---

## Step 2: Read Inputs

Read the following files from the task folder:

1. **requirement.md** — understand what was built
2. **design.md** — understand architecture decisions (if exists)
3. **plan.md** — identify files created/modified
4. **verify.md** — see verification results (if exists)

Extract:

- What features were implemented
- What decisions were made
- What files changed

---

## Step 3: Identify Files to Review

From plan.md, extract all files explicitly mentioned, created, or modified. Optionally use `git diff --name-only` to supplement.

---

## Step 4: Create review.md

Run `flower template show review` to get the template, fill sections (title, createdAt, list files to review, keep checks as pending). Write to `.agents/flower/{folder-name}/review.md`.

---

## Step 5: Review Files One-by-One

For each file, perform quality and security review.

### Quality Review

| Principle | Flag If                                                           |
| --------- | ----------------------------------------------------------------- |
| **DRY**   | Same logic appears 2+ times, copy-pasted code                     |
| **YAGNI** | Commented-out code, unused functions/variables/imports            |
| **KISS**  | Deep nesting (>3 levels), long functions (>30 lines)              |
| **Clean** | Meaningless names, cryptic abbreviations, multi-concern functions |

### Security Review

| Category         | Flag If                                                   |
| ---------------- | --------------------------------------------------------- |
| Input Validation | Missing validation on user inputs, trusting external data |
| Sensitive Data   | Hardcoded API keys/passwords, sensitive data logged       |
| Auth & Authz     | Missing auth checks, insecure sessions, improper ACL      |
| Common Vulns     | SQL injection, XSS, missing CSRF tokens                   |

---

## Step 6: Update review.md (MANDATORY)

**Mandatory after reviewing each file.**

Update checks and add issues:

```markdown
- [x] Check name
  - Status: passed | failed
  - Notes: description or recommendation
```

Add issues to Issues section by severity:

```markdown
### CRITICAL

- **file:line** - Issue description
  - Fix: recommended fix
```

---

## Step 7: Review Cross-Cutting Concerns

After all files are reviewed, check project-wide:

| Concern             | Check                                                 |
| ------------------- | ----------------------------------------------------- |
| Naming Consistency  | Consistent style (camelCase, PascalCase) across files |
| Project Conventions | Follows existing code patterns, imports, formatting   |
| Documentation       | Comments for complex logic, README/API docs updated   |
| Tests               | Unit tests for new functions, adequate coverage       |

---

## Step 8: Update review.md (MANDATORY)

Update cross-cutting concerns section with results.

---

## Step 9: Categorize Issues

### Severity Levels

| Level      | Meaning                    | Examples                                              |
| ---------- | -------------------------- | ----------------------------------------------------- |
| CRITICAL   | Must fix before proceeding | Hardcoded secrets, auth bypasses, SQL injection       |
| WARNING    | Should fix                 | Significant duplication, missing tests, no validation |
| SUGGESTION | Optional improvements      | Minor naming, small refactoring, optional docs        |

---

## Step 10: Final Summary

### Determine Recommendation

- **CRITICAL issues** → `REVIEW FAILED` — list critical issues
- **WARNING/SUGGESTION only** → `REVIEW PASSED (with notes)` — list warnings and suggestions
- **All pass** → `REVIEW PASSED`

Update review.md summary and sign-off sections.

---

## Output

Inform user: file location, files reviewed count, summary table (quality/security/cross-cutting by severity).
