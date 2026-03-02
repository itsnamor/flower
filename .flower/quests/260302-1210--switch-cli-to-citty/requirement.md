---
type: refactor
size: small
---

## 1. Problem

- The CLI (`@itsflower/cli`) parses commands manually via `process.argv[2]` with no framework — no argument validation, no auto-generated help, no extensible subcommand structure
- `@clack/prompts` is the sole runtime dependency but is only used for decorative output (`intro`, `log.info`, `outro`) — not for interactive prompts
- Adding new commands or arguments requires manual string matching and hand-written usage text, which doesn't scale

## 2. User Stories

- As a CLI developer, I want a structured command framework so that adding new subcommands is declarative and consistent
- As a CLI user, I want auto-generated `--help` and usage information so that I can discover available commands without reading source code

## 3. Scope

### Goals

- [ ] CLI uses `citty` (`defineCommand` / `runMain`) for command definition and execution
- [ ] `@clack/prompts` dependency is removed from the project
- [ ] The existing `init` subcommand is preserved with equivalent behavior
- [ ] Running `flower --help` and `flower init --help` produces auto-generated usage output

### Non-Goals

- Will NOT add interactive prompts or user input flows (explicitly deferred by user)
- Will NOT add new commands beyond the existing `init` command
- Will NOT change the project's runtime (Bun) or build configuration

## 4. Acceptance Criteria

- [ ] Given `package.json`, when inspected, then `citty` is listed as a dependency and `@clack/prompts` is absent
- [ ] Given the CLI entry point, when inspected, then there are no imports from `@clack/prompts`
- [ ] Given a terminal, when running `flower init`, then it prints "Hello, world!" and "Done!" (equivalent output to current behavior)
- [ ] Given a terminal, when running `flower --help`, then it displays auto-generated usage with the `init` subcommand listed
- [ ] Given a terminal, when running `flower` with no arguments, then it shows usage/help (not an error)

## 5. Constraints & Prerequisites

### Constraints

- Must continue using Bun as the runtime
- Entry point must remain `./src/main.ts` (referenced in `package.json` `bin` field)
