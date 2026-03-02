---
status: completed
---

## 1. Overview

Replace the manual `process.argv` parsing and `@clack/prompts` decorative output in `@itsflower/cli` with `citty`'s `defineCommand` / `runMain` pattern. The `init` subcommand is preserved with equivalent console output. `@clack/prompts` is removed entirely.

## 2. Technical Decisions

- **`citty` instead of other CLI frameworks (commander, yargs, oclif)**: The user explicitly requested citty. It's lightweight, TypeScript-first, supports subcommands and auto-generated help — a good fit for this early-stage CLI.
- **Plain `console.log` instead of a styled output library**: Since `@clack/prompts` is being removed and the user said interaction isn't needed, plain console output is sufficient. A styled logger can be added later if needed.

## 3. Tasks

### Dependency swap

- [x] **Task 1**: Remove `@clack/prompts` and install `citty`
  - AC:
    - `package.json` lists `citty` in `dependencies` and does not list `@clack/prompts`
    - `bun install` completes without errors
  - Approach: Run `bun remove @clack/prompts && bun add citty` in `packages/cli/`

### CLI rewrite

- [x] **Task 2**: Rewrite `src/main.ts` to use citty's `defineCommand` and `runMain`
  - AC:
    - `main.ts` imports `defineCommand` and `runMain` from `citty`
    - A main command is defined with `meta` (name, version, description)
    - `init` is registered as a subcommand via `subCommands`
    - Running `flower init` prints "Hello, world!" and "Done!"
    - Running `flower --help` shows auto-generated usage with `init` listed
    - Running `flower` with no arguments shows usage/help
    - No imports from `@clack/prompts` remain
  - Approach: Define a root command with `meta` fields and an `init` subcommand using `defineCommand`. The `init` subcommand's `run` function uses `console.log` for output. Pass the root command to `runMain`.
  - Blocked by: Task 1

### Verification

- [x] **Task 3**: Verify the CLI works end-to-end
  - AC:
    - `flower --help` displays usage with `init` subcommand
    - `flower init` outputs greeting and completion messages
    - `flower init --help` displays init-specific usage
    - No runtime errors
  - Approach: Run each command manually via `bun packages/cli/src/main.ts` with various arguments and verify output
  - Blocked by: Task 2
