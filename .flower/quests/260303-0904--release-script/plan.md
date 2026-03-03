---
status: completed
---

## 1. Overview

Create a standalone `scripts/release.ts` script that bumps the semver version, syncs it to `main.ts`, builds, publishes to npm, and creates a git commit + tag. The script is invoked via a `release` entry in `packages/cli/package.json` using `bun run ../../scripts/release.ts`.

## 2. Technical Decisions

- **Standalone `scripts/release.ts` with no dependencies**: The script only needs to read/write JSON and text files, run shell commands, and parse CLI args — all available via Bun built-ins. No libraries needed.
- **`Bun.argv` for arg parsing**: Simple flag detection (`--major`, `--minor`, `--patch`) doesn't warrant a CLI framework.
- **Regex replace for `main.ts` version sync**: The version string in `main.ts` appears as `version: "x.y.z"` inside the `defineCommand` meta object. A targeted regex replace is sufficient and avoids AST parsing.

## 3. Tasks

### Release Script

- [x] **Task 1**: Create `scripts/release.ts` with semver bump logic
  - AC:
    - `--major` on `0.1.0` produces `1.0.0`
    - `--minor` on `0.1.0` produces `0.2.0`
    - `--patch` on `0.1.0` produces `0.1.1`
    - No flag exits with usage error and non-zero code
  - Approach: Read `packages/cli/package.json`, parse current version, split on `.`, bump the appropriate segment, write back.

- [x] **Task 2**: Add version sync to `packages/cli/src/main.ts`
  - AC:
    - After bump, the `version: "x.y.z"` line in `main.ts` matches the new version in `package.json`
  - Approach: Read `main.ts`, regex replace `version: "..."` in the `defineCommand` meta block, write back.
  - Blocked by: Task 1

- [x] **Task 3**: Add build, publish, git commit + tag steps
  - AC:
    - Script runs `bun run build` in `packages/cli/`
    - Script runs `npm publish` in `packages/cli/`
    - Script creates a git commit with message `release: v<version>` and tag `v<version>`
  - Approach: Use `Bun.spawn` (or `Bun.$`) to run shell commands sequentially, exit on failure.
  - Blocked by: Task 2

- [x] **Task 4**: Add `release` script entry to `packages/cli/package.json`
  - AC:
    - `bun release --major` from `packages/cli/` invokes `scripts/release.ts`
  - Approach: Add `"release": "bun run ../../scripts/release.ts"` to the `scripts` object.
  - Blocked by: Task 3
