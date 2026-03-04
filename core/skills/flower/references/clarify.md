# Phase 1: Clarify

Clarify user requirements, clearly describing WHAT and WHY, **not** HOW.

## Workflow

```mermaid
flowchart TD
    Start([User input]) --> C1[Analyze]
    C1 --> C2[Research]
    C2 --> C3{Ambiguities resolved?}
    C3 -- No --> C4[Ask for clarification]
    C4 --> C1
    C3 -- Yes --> C5[Create `requirement.md`]
    C5 --> End([Proceed to Phase 2: Plan])
```

For each step, follow the instructions below **strictly**

## Steps

### Analyze

Read user input word by word. Extract:

- **Codebase keywords** → file names, modules, functions, endpoints, components mentioned — feed into codebase exploration
- **Technology keywords** → libraries, frameworks, languages, tools, APIs mentioned — feed into documentation lookup
- **Intent** → feature, bug fix, refactor, or enhancement
- **Constraints** → explicit or implicit limitations
- **Ambiguities** → anything with multiple interpretations — feed into clarification questions

### Research

Use extracted keywords to investigate before asking:

- **Codebase** → grep, glob, read files, `repomix` — understand existing code, patterns, architecture
- **Technology** → use MCPs (`context7`, ...), fetch - understand relevant docs for mentioned technologies
- **External**: look up APIs, standards, or domain concepts the human referenced

### Ask for clarification

Only if ambiguities remain after research:

| Rule            | Detail                                                 |
| --------------- | ------------------------------------------------------ |
| Provide options | Prefer choices, not open questions.                    |
| Batch questions | Group related questions. Max 5 per round.              |
| Be specific     | Reference concrete code, files, or behaviors.          |
| Easy to answer  | Human answers in few words or picks option.            |
| Show research   | Share what you found to give context to your question. |

After each response, restart: analyze → research based on new info → evaluate remaining ambiguities, gaps.

### Create `requirement.md`

Template in `.flower/templates/requirement.md`.

| Section                     | Content                                                             |
| --------------------------- | ------------------------------------------------------------------- |
| Problem                     | Who is affected, when, what goes wrong. 2–5 bullets. No solutions.  |
| User Stories                | "As a [user], I want [action] so that [benefit]"                    |
| Goals                       | Verifiable outcomes — each yes/no checkable                         |
| Non-Goals                   | Explicitly excluded — anything someone might assume is in scope     |
| Acceptance Criteria         | Given/When/Then — pass/fail testable, no subjective judgment        |
| Constraints & Prerequisites | Hard limits (unchangeable) + external requirements for this feature |
| Glossary                    | Domain-specific terms only. Skip if self-explanatory.               |

## Validate

- [ ] Every goal is concrete and verifiable
- [ ] Every goal has at least one acceptance criterion
- [ ] Scope boundaries are unambiguous
- [ ] All ambiguities from Q&A are resolved in the document — none deferred
- [ ] Constraints are realistic and compatible with each other

## Rules

- **Read before asking** — research first, ask only what you can't answer
- **Every word matters** — read input thoroughly, don't skip anything
- **Options over open-ended** — prefer always giving choices when asking
- **Problem ≠ solution** — describe what's wrong, not how to fix it
- **Non-Goals prevent scope creep** — put effort here
- **Self-contained but concise** — a reader must understand the problem and success criteria without reading the codebase
- **No assumptions** — ambiguities must be resolved through research or Q&A, never assumed
