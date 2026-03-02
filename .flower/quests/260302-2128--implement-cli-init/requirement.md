---
type: feature
size: small
---

## 1. Problem

- The `flower init` command is a stub — it prints "Hello, world!" instead of initializing a project.
- Users have no way to bootstrap `.flower/templates/` in their project directory via the CLI.
- Without local templates, the flower workflow cannot scaffold quest artifacts (`requirement.md`, `plan.md`, `journal.md`, `review.md`).

## 2. User Stories

- As a developer, I want to run `bunx @itsflower/cli init` so that all flower templates are copied into my project's `.flower/templates/` directory, ready for use.

## 3. Scope

### Goals

- [ ] `flower init` copies all 4 templates (`requirement.md`, `plan.md`, `journal.md`, `review.md`) from `core/templates/` into `./.flower/templates/` relative to the current working directory.
- [ ] The `.flower/templates/` directory is created if it does not exist.
- [ ] The command provides user-visible feedback on success.

### Non-Goals

- Prompting the user for configuration options during init.
- Generating a `.flower/quests/` directory or any quest scaffolding.
- Overwrite protection or conflict resolution for existing templates.
- Supporting custom template directories or alternative template sources.

## 4. Acceptance Criteria

- Given a directory with no `.flower/` folder, when the user runs `bunx @itsflower/cli init`, then `.flower/templates/` is created containing `requirement.md`, `plan.md`, `journal.md`, and `review.md` with contents identical to those in `core/templates/`.
- Given a directory where `.flower/templates/` already exists, when the user runs `bunx @itsflower/cli init`, then existing templates are overwritten with the latest versions.
- Given a successful init, when the command completes, then a success message is printed to stdout.

## 5. Constraints & Prerequisites

### Constraints

- Runtime: Bun (no Node.js APIs beyond what Bun supports).
- CLI framework: citty.
- Templates must be bundled within the CLI package — `core/templates/` is in the monorepo root and not accessible when the package is distributed via `bunx`.

### Prerequisites

- The 4 template files in `core/templates/` must exist and be finalized.
