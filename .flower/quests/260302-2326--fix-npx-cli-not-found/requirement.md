---
type: bug-fix
size: small
---

## 1. Problem

- When a user runs `npx @itsflower/cli`, the shell returns `sh: flower: command not found` instead of executing the CLI.
- The same package works correctly with `bunx @itsflower/cli`.
- The `bin` field in `package.json` maps `"flower"` → `"./dist/main.js"`, and the built file contains a valid `#!/usr/bin/env node` shebang.
- The published `dist/main.js` likely lacks the executable permission bit (`+x`), which `npx`/npm requires but `bunx` tolerates.
- The `prepack` script does not run `build`, so publishing from a clean checkout could also result in a missing `dist/main.js`.

## 2. User Stories

- As a developer, I want to run `npx @itsflower/cli` so that I can use the CLI without installing it globally, regardless of my package manager.

## 3. Scope

### Goals

- [ ] `npx @itsflower/cli` executes successfully (no "command not found" error)
- [ ] `dist/main.js` has the executable permission bit set in the published tarball
- [ ] The publish pipeline (`prepack`) ensures `dist/` is built before packing

### Non-Goals

- Supporting other package managers beyond npm/npx and bun/bunx (e.g., pnpm dlx) — not tested, not guaranteed
- Changing the CLI framework, command structure, or runtime behavior
- Adding CI/CD publishing automation

## 4. Acceptance Criteria

- Given a freshly published `@itsflower/cli` package, when a user runs `npx @itsflower/cli`, then the CLI executes and prints usage/help output (no shell errors).
- Given a clean checkout of the repository, when running `npm pack` in `packages/cli/`, then `dist/main.js` is included in the tarball with executable permissions.
- Given the `prepack` script runs, then `dist/main.js` is built before the package is packed.

## 5. Constraints & Prerequisites

### Constraints

- Build tool is `tsup`; must not be replaced.
- Runtime must remain Node.js-compatible (shebang: `#!/usr/bin/env node`).
- `prepack`/`postpack` symlink dance for `templates/` must be preserved.

### Prerequisites

- `tsup` and `typescript` are available as dev dependencies (already present).
