---
type: enhancement
size: small
---

## 1. Problem

- When a user runs `flower init`, only the 4 markdown templates are copied to `.flower/templates/` in the project.
- The flower skill (`SKILL.md` + `references/`) is not installed to the crush agent at `~/.config/crush/skills/flower/`.
- The flower command (`flower.md`) is not installed to the crush agent at `~/.config/crush/commands/flower.md`.
- Users must manually copy these files to use flower with the crush agent.

## 2. User Stories

- As a developer, I want `flower init` to install the flower skill to my crush agent so that I can use the flower workflow immediately after init.
- As a developer, I want `flower init` to install the flower command to my crush agent so that I can trigger the flower workflow via the command.
- As a developer, I want to be notified when existing skill/command files are overridden so that I know my configuration was updated.

## 3. Scope

### Goals

- [ ] `flower init` copies the flower skill (`SKILL.md` + `references/` directory) to `~/.config/crush/skills/flower/`
- [ ] `flower init` copies the flower command (`flower.md`) to `~/.config/crush/commands/flower.md`
- [ ] If the skill or command already exists, it is overwritten
- [ ] User is notified in the console when files are overridden (vs freshly installed)

### Non-Goals

- Not adding an `--no-skill` or `--no-command` flag — always install both
- Not supporting custom crush config paths
- Not modifying `crush.json` or any other crush configuration files
- Not installing skills/commands for agents other than crush

## 4. Acceptance Criteria

- Given a clean system with no existing flower skill/command, when `flower init` runs, then the skill directory and command file are created under `~/.config/crush/` and a "installed" message is printed.
- Given an existing flower skill/command in `~/.config/crush/`, when `flower init` runs, then the files are overwritten and an "overridden" (or "updated") message is printed to notify the user.
- Given `flower init` runs, then templates are still copied to `.flower/templates/` as before (existing behavior preserved).

## 5. Constraints & Prerequisites

### Constraints

- Target directories: `~/.config/crush/skills/flower/` and `~/.config/crush/commands/`
- Source files are bundled in the npm package alongside templates (under `skills/` and `commands/` directories)
- Must work cross-platform (macOS, Linux) — use `os.homedir()` for home directory resolution

### Prerequisites

- The `core/skills/flower/` and `core/commands/flower.md` must be bundled into the published npm package (added to `files` in `package.json` and copied during `prepack`)
