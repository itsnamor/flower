---
status: completed
---

## 1. Summary

Added a `scripts/release.ts` script and a `release` entry in `packages/cli/package.json` that automates the full release flow: semver bump (`--major`, `--minor`, `--patch`), version sync to `main.ts`, build via `tsup`, npm publish, and git commit + tag. Running with no flag exits with a usage error. Invoked via `bun release --major` from `packages/cli/`.

## 2. Quality Checklist

- [x] Dead code & unused files removed
- [x] Project standards followed (style, structure, patterns, linting)
- [x] No security issues (secrets, injection, auth bypass, etc.)
- [x] Performance acceptable — script is a one-shot CLI tool, no performance concerns
- [x] All tests pass — no-flag error case verified; no existing test suite to regress
- [x] Documentation up to date — no user-facing docs exist, skip

## 3. Memories

### Bun scripts at repo root don't need tsconfig for type-checking
- **content**: Scripts in `scripts/` using Bun APIs (`Bun.argv`, `Bun.spawn`) will fail `tsc --noEmit` without a root tsconfig with `@types/bun`. This is fine since they're only run via `bun run` which handles transpilation natively.
- **tags**: bun, typescript, scripts, tooling
- **scope**: project:flower
