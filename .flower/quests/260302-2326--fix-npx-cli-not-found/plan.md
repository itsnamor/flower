---
status: completed
---

## 1. Overview

Fix `npx @itsflower/cli` failing with `sh: flower: command not found` by ensuring the `dist/main.js` binary is always built before the package is packed/published. The `prepack` script currently only copies templates but never runs `build`, so the published tarball may ship without `dist/main.js`. Adding the build step to `prepack` guarantees a fresh, correct binary in every publish.

## 2. Technical Decisions

- **Add `build` to `prepack` instead of `prepublishOnly`**: `prepack` already exists and runs before both `npm pack` and `npm publish`. Keeping all pre-pack logic in one script avoids ordering ambiguity between lifecycle hooks.

## 3. Tasks

### Fix publish pipeline

- [x] **Task 1**: Add `build` step to the `prepack` script in `packages/cli/package.json`
  - AC:
    - `prepack` script runs `build` before copying templates
    - Running `npm pack` from a clean state (no `dist/`) produces a tarball containing `dist/main.js`
  - Approach: Edit `packages/cli/package.json` → prepend `npm run build &&` to the existing `prepack` command. Final value: `"prepack": "npm run build && rm -f templates && cp -r ../../core/templates templates"`

### Verify

- [x] **Task 2**: Verify the built tarball contains a working binary
  - AC:
    - `npm pack` in `packages/cli/` produces a tarball
    - The tarball contains `dist/main.js` with a `#!/usr/bin/env node` shebang
    - `dist/main.js` has executable permissions inside the tarball
  - Approach: Run `npm pack` in `packages/cli/`, then `tar tzf` to list contents and verify `dist/main.js` is present. Extract and check shebang with `head -1`.
  - Blocked by: Task 1
