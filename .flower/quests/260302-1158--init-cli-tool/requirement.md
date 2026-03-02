---
type: feature
size: small
---

## 1. Problem

- The flower project has no CLI tool — users cannot scaffold or interact with flower from the command line
- There is no `packages/` directory or any package infrastructure in the monorepo yet
- Users need a way to run `bunx @itsflower/cli init` to get started with flower

## 2. User Stories

- As a developer, I want to run `bunx @itsflower/cli init` so that I can bootstrap flower in my project

## 3. Scope

### Goals

- [ ] A `packages/cli` package exists with package name `@itsflower/cli`
- [ ] Running `bunx @itsflower/cli init` prints a "hello world" message using `@clack/prompts`
- [ ] The CLI is minimal — fewest files possible

### Non-Goals

- Will NOT implement actual init logic (scaffolding, config generation, etc.)
- Will NOT add tests, linting, or CI configuration
- Will NOT set up a monorepo workspace root `package.json`
- Will NOT publish to npm

## 4. Acceptance Criteria

- [ ] Given `packages/cli` exists, when running `bun run packages/cli/src/index.ts init`, then a hello world message is displayed via clack/prompts
- [ ] Given the package.json in `packages/cli`, then the `name` field is `@itsflower/cli` and a `bin` entry points to the CLI entrypoint
- [ ] Given the CLI is invoked without the `init` command, then it shows usage information or a help message

## 5. Constraints & Prerequisites

### Constraints

- Must use `bun` as the package manager and runtime
- Must use `@clack/prompts` for CLI output
- Must be located in `packages/cli`
- Minimal file count — only what's strictly necessary
