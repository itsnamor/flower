---
status: completed
---

## 1. Summary

Fixed `npx @itsflower/cli` failing with `sh: flower: command not found` by adding `npm run build` to the `prepack` script in `packages/cli/package.json`. The root cause was that `prepack` only copied templates but never built `dist/main.js`, so the published tarball could ship without the binary. After the fix, `npm pack` from a clean state produces a tarball with a correctly built, executable `dist/main.js` containing the `#!/usr/bin/env node` shebang.

## 2. Quality Checklist

- [x] Dead code & unused files removed — single-line change, nothing added or orphaned
- [x] Project standards followed — matches existing script style in `package.json`
- [x] No security issues — no secrets, no new attack surface
- [x] Performance acceptable — N/A (build-time script only)
- [x] All tests pass — N/A (no test suite exists); verified manually via `npm pack --dry-run`
- [x] Documentation up to date — no user-facing docs affected

## 3. Memories

### CLI prepack must build dist before packing
- **content**: The `prepack` npm lifecycle hook runs before both `npm pack` and `npm publish`. If bin files are built artifacts (e.g., tsup output), `prepack` must include the build step. Without it, publishing from a clean checkout ships an empty or missing `dist/`, causing `npx` to fail with "command not found". `bunx` may still work because it resolves bins differently.
- **tags**: npm, cli, publishing, prepack, bin, tsup
- **scope**: project:flower
