---
name: flower-verify
description: Verify implementation completeness, correctness, and coherence. Check plan tasks completion, test acceptance criteria, and verify design adherence. Triggers on 'verify', 'test', 'validate', 'check implementation'.
---

Verify implementation is complete, correct, and coherent.

## Core Principle

This phase is **verification and documentation only**. Assess what was built against what was planned — do not fix anything.

### Do

- Read and analyze all documents and code
- Run tests and inspect implementation
- Create and update `verify.md`

### Do Not

- Modify implementation code
- Fix bugs (document them instead)
- Make file changes (except `verify.md`)

---

## Step 1: Get Task Path

Check user input for path, folder name, or partial match. Construct full path `.agents/flower/{folder-name}` and verify files exist. If not found, ask user.

---

## Step 2: Read Inputs

Read the following files from the task folder:

1. **requirement.md** — understand what to build and acceptance criteria
2. **design.md** — understand architecture and key decisions (if exists)
3. **plan.md** — see task breakdown and completion status

Extract:

- Task type and acceptance criteria
- All tasks with checkbox status
- Design decisions and architecture choices (if design.md exists)
- Scope and constraints

---

## Step 3: Check Completeness

**Question:** Are all tasks from plan.md complete?

Count tasks marked `- [x]` (complete) vs `- [ ]` (incomplete).

- All complete → **Pass**
- Core tasks missing → **CRITICAL**
- Minor tasks missing → **WARNING**

---

## Step 4: Update verify.md (MANDATORY)

Run `flower template show verify` to get the template, then create `.agents/flower/{folder-name}/verify.md`. Fill Completeness section: task count, completion percentage, incomplete tasks, issue level.

---

## Step 5: Check Correctness

**Question:** Does implementation satisfy all acceptance criteria?

### Extract ACs from requirement.md

Look for "Acceptance Criteria" section, "AC1:", "AC2:", etc.

### Test Each AC

For each acceptance criteria:

1. **Identify AC type** (UI/API/Data/Error/Performance/Integration)
2. **Choose testing method** based on context:

| Method              | When to Use                      |
| ------------------- | -------------------------------- |
| **Static Analysis** | No running app — code inspection |
| **Dynamic Testing** | App is running — test behavior   |
| **Test Suite**      | Tests exist — run and check      |

3. **Perform verification** — find relevant files, analyze or run tests
4. **Document result** with evidence (files, line numbers, test output)

### Report per AC

- Status: passed / failed
- Method: Static Analysis / Dynamic Testing / Test Suite
- Files: implementing files
- Evidence: specific findings

All passed → **Pass**. Any failed → **CRITICAL**.

---

## Step 6: Update verify.md (MANDATORY)

Update Correctness section with each AC result:

```markdown
- [x] AC1: description
  - Status: passed
  - Method: Static Analysis
  - Files: src/auth.ts
  - Evidence: validation logic at line 42
```

---

## Step 7: Check Coherence

**Skip if design.md does not exist.**

**Question:** Does implementation follow design decisions?

For each design decision:

1. Search codebase for implementation
2. Check if decision is followed
3. Document evidence

Also check code pattern consistency: naming conventions, file structure, import patterns, code style.

- All followed → **Pass**
- Design violated → **WARNING**
- Pattern inconsistencies → **SUGGESTION**

---

## Step 8: Update verify.md (MANDATORY)

Update Coherence section with design decision results and pattern consistency findings.

---

## Step 9: Final Summary

### Calculate Overall Status

| Dimension    | Possible Status             |
| ------------ | --------------------------- |
| Completeness | Pass / WARNING / CRITICAL   |
| Correctness  | Pass / CRITICAL             |
| Coherence    | Pass / WARNING / SUGGESTION |

### Determine Recommendation

- **CRITICAL issues** → `VERIFICATION FAILED` — list critical issues
- **WARNING/SUGGESTION only** → `VERIFICATION PASSED (with notes)` — list warnings and suggestions
- **All pass** → `VERIFICATION PASSED`

Update verify.md summary and sign-off sections.

---

## Issue Levels

| Level      | Meaning                    | Action                           |
| ---------- | -------------------------- | -------------------------------- |
| CRITICAL   | Must fix before proceeding | Stop, fix immediately            |
| WARNING    | Should fix                 | Fix if possible, document reason |
| SUGGESTION | Nice to fix                | Optional, can skip               |

---

## Output

Inform user: file location, summary table (completeness/correctness/coherence), issue count by level.
