---
type: feature
size: small
---

## 1. Problem

- The `@itsflower/cli` package has no automated release process — version bumping, building, publishing, and tagging are all manual steps prone to human error.
- The version string in `packages/cli/src/main.ts` must stay in sync with `packages/cli/package.json`, but there's no mechanism to enforce that.
- Developers must remember the correct sequence (bump → sync → build → publish → git tag) every time they release.

## 2. User Stories

- As a maintainer, I want to run `bun release --major` (or `--minor`, `--patch`) so that the version is bumped, built, published, and tagged in one command.

## 3. Scope

### Goals

- [ ] A `release` script in `packages/cli/package.json` that accepts `--major`, `--minor`, or `--patch`
- [ ] The script bumps the version in `packages/cli/package.json`
- [ ] The script syncs the version string into `packages/cli/src/main.ts`
- [ ] The script builds the package (`tsup`)
- [ ] The script publishes to npm (`npm publish`)
- [ ] The script creates a git commit and tag (e.g., `v0.2.0`)

### Non-Goals

- Changelog generation
- CI/CD integration or GitHub Actions
- Monorepo workspace tooling or root `package.json`
- Pre-release / alpha / beta version support
- Interactive prompts or confirmation dialogs
- `--dry-run` or other safety flags

## 4. Acceptance Criteria

- Given `--major` on version `0.1.0`, when the script runs, then `package.json` version becomes `1.0.0`, `main.ts` version becomes `"1.0.0"`, the package is built, published, and a git commit + tag `v1.0.0` is created.
- Given `--minor` on version `0.1.0`, when the script runs, then version becomes `0.2.0` everywhere.
- Given `--patch` on version `0.1.0`, when the script runs, then version becomes `0.1.1` everywhere.
- Given no flag is passed, when the script runs, then it exits with a usage error.
- Given `--major`, `--minor`, or `--patch`, when the script completes, then `packages/cli/src/main.ts` contains the same version string as `packages/cli/package.json`.

## 5. Constraints & Prerequisites

### Constraints

- Script lives in `scripts/release.ts` and is referenced from `packages/cli/package.json`
- Must run with `bun` (TypeScript, no compile step needed)
- Must use standard semver bumping logic

### Prerequisites

- `bun` available in PATH
- npm authentication configured (`npm whoami` works)
- Clean git working directory before release
