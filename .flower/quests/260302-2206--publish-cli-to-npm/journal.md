## Entries

### npm pack does not follow symlinks — use prepack/postpack scripts

- **tags**: npm, publishing, symlinks, packaging
- **scope**: project:flower
- **context**: Task 6 verification — `npm pack --dry-run` showed only 4 files in the tarball, missing all 4 template files despite `"files": ["dist", "templates"]` in package.json.
- **insight**: `packages/cli/templates` is a symlink → `../../core/templates`. npm pack silently skips symlinked directories. Fixed with `prepack` (replace symlink with real copy) and `postpack` (restore symlink) scripts. This is a known npm limitation with no built-in workaround.

## Deviations from Plan

| Planned | Actual | Reason |
| ------- | ------ | ------ |
| `files: ["dist", "templates"]` would include templates | Added `prepack`/`postpack` scripts to replace symlink with real files during pack | `templates/` is a symlink to `../../core/templates` — npm pack silently skips symlinks |
