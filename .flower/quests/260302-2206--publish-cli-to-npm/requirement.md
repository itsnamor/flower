---
type: feature
size: small
---

## 1. Problem

- The `@itsflower/cli` package exists locally but is not published to npm, so users cannot install or run it via `npx` or `bunx`.
- The CLI currently uses Bun-specific APIs (`Bun.write`, `Bun.file`, `import.meta.dir`) and a `#!/usr/bin/env bun` shebang, making it incompatible with Node.js / `npx`.
- The `bin` field points to raw `.ts` source (`./src/main.ts`), which only works under Bun's native TS execution — not in a standard npm package consumed via Node.
- There is no build step, no `files` field, no `publishConfig`, no README, and no LICENSE — the package is not publish-ready.
- The `package.json` has no `scripts` block at all.

## 2. User Stories

- As a developer, I want to run `bunx @itsflower/cli init` so that I can scaffold flower templates in my project using Bun.
- As a developer, I want to run `npx @itsflower/cli init` so that I can scaffold flower templates in my project using Node.js.

## 3. Scope

### Goals

- [ ] The CLI is published to npmjs.com as a public package under `@itsflower/cli`
- [ ] `bunx @itsflower/cli init` works correctly
- [ ] `npx @itsflower/cli init` works correctly
- [ ] The published package contains only the necessary files (compiled output + templates)
- [ ] The `package.json` has correct metadata for npm (bin, files, publishConfig, version, description, license, keywords, repository)

### Non-Goals

- Automated CI/CD publishing pipeline (GitHub Actions) — manual `npm publish` is sufficient
- Adding new CLI commands beyond the existing `init`
- Changelog or release notes tooling
- Unit tests for the CLI
- Supporting package managers other than npm (e.g., publishing to JSR, Homebrew)

## 4. Acceptance Criteria

- Given the package is published, when a user runs `npx @itsflower/cli init` in a project directory (with Node.js installed), then `.flower/templates/` is created with all 4 template files.
- Given the package is published, when a user runs `bunx @itsflower/cli init` in a project directory (with Bun installed), then `.flower/templates/` is created with all 4 template files.
- Given the source code, when `npm pack` is run in `packages/cli/`, then the tarball contains only compiled JS, templates, package.json, README, and LICENSE — no `.ts` source files.
- Given the package.json, when inspected, then `publishConfig.access` is set to `"public"`.

## 5. Constraints & Prerequisites

### Constraints

- Must work on both Node.js (>=18) and Bun runtimes
- Bun-specific APIs (`Bun.write`, `Bun.file`, `import.meta.dir`) must be replaced with Node.js-compatible equivalents
- The compiled output must be a single JS entry point (or minimal files) that the `bin` field points to
- Must use an existing bundler/compiler (e.g., tsup, unbuild, or bun build) — no custom build scripts

### Prerequisites

- `@itsflower` organization already exists on npmjs.com
- npm authentication is configured locally (`npm login` or token)
