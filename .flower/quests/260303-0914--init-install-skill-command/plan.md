---
status: completed
---

## 1. Overview

Extend the `flower init` CLI command to also install the flower skill and command into the crush agent's config directory (`~/.config/crush/`). The skill directory (`SKILL.md` + `references/`) is copied to `~/.config/crush/skills/flower/`, and the command file (`flower.md`) is copied to `~/.config/crush/commands/`. Existing files are overwritten with a notification message. Source assets must be bundled in the npm package alongside templates.

## 2. Technical Decisions

- **Use `os.homedir()` for crush config path**: Resolves `~/.config/crush/` cross-platform without shell expansion.
- **Recursive directory copy for skill**: The skill has a `references/` subdirectory with multiple files — implement a recursive copy helper rather than flat file listing.
- **Check existence before copy to differentiate "installed" vs "updated" messaging**: Use `fs.access` or `fs.stat` to detect if target already exists before overwriting.
- **Bundle skills/ and commands/ directories in npm package**: Add to `files` array in `package.json` and extend `prepack`/`postpack` scripts to copy from `core/` like templates.

## 3. Tasks

### Packaging

- [ ] **Task 1**: Add `skills` and `commands` directories to the npm package bundle
  - AC:
    - `package.json` `files` array includes `"skills"` and `"commands"`
    - `prepack` script copies `core/skills` and `core/commands` into the package directory
    - `postpack` script cleans up and restores symlinks if needed
  - Approach: Edit `packages/cli/package.json` — add `"skills"`, `"commands"` to `files`, extend `prepack` to `cp -r ../../core/skills skills && cp -r ../../core/commands commands`, extend `postpack` to clean up.

### CLI init command

- [ ] **Task 2**: Add a recursive copy helper function to `main.ts`
  - AC:
    - Function recursively copies a source directory to a destination directory, creating subdirectories as needed
    - Function returns a list of copied file paths for logging
  - Approach: Add `copyDirRecursive(src, dest)` in `packages/cli/src/main.ts` using `readdir` with `withFileTypes`, `mkdir` recursive, `readFile`/`writeFile`.

- [ ] **Task 3**: Add skill installation logic to the `init` command
  - AC:
    - Running `flower init` copies `skills/flower/` (SKILL.md + references/) to `~/.config/crush/skills/flower/`
    - If `~/.config/crush/skills/flower/` already exists, files are overwritten and console prints "Updated existing skill: flower"
    - If it does not exist, console prints "Installed skill: flower"
  - Approach: In the `init` command's `run` function, resolve `skillSrc = resolve(__dirname, "../skills/flower")` and `skillDest = resolve(homedir(), ".config/crush/skills/flower")`. Check if `skillDest` exists with `stat`. Use `copyDirRecursive` to copy. Print appropriate message.
  - Blocked by: Task 2

- [ ] **Task 4**: Add command installation logic to the `init` command
  - AC:
    - Running `flower init` copies `commands/flower.md` to `~/.config/crush/commands/flower.md`
    - If `~/.config/crush/commands/flower.md` already exists, it is overwritten and console prints "Updated existing command: flower"
    - If it does not exist, console prints "Installed command: flower"
  - Approach: In the `init` command's `run` function, resolve `cmdSrc = resolve(__dirname, "../commands/flower.md")` and `cmdDest = resolve(homedir(), ".config/crush/commands/flower.md")`. Check existence, `mkdir` parent, copy file, print message.
  - Blocked by: Task 1

### Verification

- [ ] **Task 5**: Build and manually verify the updated `init` command
  - AC:
    - `bun run build` succeeds
    - Running `node dist/main.js init` copies templates, skill, and command to correct locations
  - Approach: Run build in `packages/cli/`, execute the compiled output, verify files exist at destinations.
