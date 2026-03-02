---
status: completed
---

## 1. Overview

Initialize a minimal CLI package at `packages/cli` with package name `@itsflower/cli`. The CLI uses `@clack/prompts` and supports an `init` command that prints a hello world message. Only the essential files are created: `package.json`, `tsconfig.json`, and `src/index.ts`.

## 2. Technical Decisions

- **`@clack/prompts` for CLI UI**: Specified by the user. Provides beautiful, structured terminal prompts out of the box.
- **Single entrypoint `src/index.ts`**: Keeps the file count minimal — command parsing and output in one file.
- **Bun as runtime and package manager**: Matches the project's existing tooling (evidenced by the user's `bunx` usage).

## 3. Tasks

### Setup

- [x] **Task 1**: Create `packages/cli/package.json` with `@itsflower/cli` name and bin entry
  - AC:
    - `packages/cli/package.json` exists with `name: "@itsflower/cli"`
    - `bin` field maps `flower` to the built entrypoint
    - `@clack/prompts` is listed as a dependency
  - Approach: Create `packages/cli/package.json` with name, version, bin, dependencies (`@clack/prompts`), and devDependencies (`typescript`, `@types/bun`). Keep fields minimal.

- [x] **Task 2**: Create `packages/cli/tsconfig.json`
  - AC:
    - `tsconfig.json` exists with target and module settings compatible with Bun
  - Approach: Create a minimal `tsconfig.json` targeting ESNext with bundler module resolution.
  - Blocked by: Task 1

- [x] **Task 3**: Create `packages/cli/src/index.ts` with `init` command that prints hello world via clack
  - AC:
    - Running `bun run packages/cli/src/index.ts init` displays a hello world intro/outro via `@clack/prompts`
    - Running without `init` shows a usage/help message
  - Approach: Parse `process.argv` for the `init` command. Use `@clack/prompts` `intro` and `outro` to display a hello world message. Show usage if no recognized command is given. Add a shebang line for bin usage.
  - Blocked by: Task 1

- [x] **Task 4**: Install dependencies with `bun install`
  - AC:
    - `bun install` succeeds in `packages/cli`
    - `node_modules` contains `@clack/prompts`
  - Approach: Run `bun install` from `packages/cli`.
  - Blocked by: Task 1, Task 2, Task 3

- [x] **Task 5**: Verify the CLI works end-to-end
  - AC:
    - `bun run packages/cli/src/index.ts init` prints hello world via clack prompts
    - `bun run packages/cli/src/index.ts` (no args) prints usage info
  - Approach: Run both commands and verify output.
  - Blocked by: Task 4
