---
status: completed
---

## 1. Summary

Extended the `flower init` CLI command to install the flower skill and command into the crush agent's config directory (`~/.config/crush/`). The skill directory (`SKILL.md` + `references/`) is copied to `~/.config/crush/skills/flower/`, and the command file (`flower.md`) is copied to `~/.config/crush/commands/`. Existing files are overwritten with clear "Updated existing…" vs "Installed…" console messaging. The npm package bundle was updated to include `skills/` and `commands/` directories via `prepack`/`postpack` scripts.

## 2. Quality Checklist

- [x] Dead code & unused files removed
- [x] Project standards followed (style, structure, patterns, linting)
- [x] No security issues (secrets, injection, auth bypass, etc.)
- [x] Performance acceptable
- [x] All tests pass (build succeeds, manual verification of fresh install, update, and override cases)
- [x] Documentation up to date (no user-facing docs to update)

## 3. Memories

### flower CLI bundles core assets via prepack/postpack symlink pattern
- **content**: The `packages/cli/` uses symlinks during development (`ln -s ../../core/X X`) and replaces them with real copies during `prepack` for npm publishing, then restores symlinks in `postpack`. When adding new bundled directories (skills, commands), follow this same pattern: add to `files` array, extend `prepack` to `cp -r`, extend `postpack` to `rm -rf` the copies.
- **tags**: cli, packaging, npm, symlinks
- **scope**: project:flower
