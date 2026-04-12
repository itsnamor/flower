# flower

CLI tool that scaffolds structured development workflows in any project.

## Project Overview

`flower` is a CLI (`@flowrr/cli`) that copies workflow skills to a target project's `.agents/skills/` directory. These skills guide agents through a structured development process: propose → design → plan → implement → verify → review.

## Commands

### CLI Package (`packages/cli`)

```bash
# Development
bun run dev                    # Run CLI locally via bun

# Build
bun run build                  # Build to dist/ (Node.js target, not Bun)

# Type checking
bun run typecheck              # Run tsc --noEmit
```

### Root

```bash
# Publish CLI to npm
bun run publish:cli --patch    # or --minor, --major
```

## Architecture

```
flower/
├── packages/cli/              # CLI package (@itsflower/cli)
│   ├── src/
│   │   ├── main.ts            # Entry point, uses citty for CLI framework
│   │   ├── commands/          # CLI commands (setup, doctor, version)
│   │   ├── lib/               # Utilities (paths, fs, constants, package)
│   │   └── utils/             # Helper functions (error handling)
│   └── skills/                # Skills bundled with CLI (copied at build)
│
└── skills/                    # Source skills (source of truth)
    ├── flower-propose/        # Capture requirements → requirement.md
    ├── flower-design/         # Create technical design → design.md
    ├── flower-plan/           # Break down into tasks → plan.md
    ├── flower-implement/      # Execute implementation → code changes
    ├── flower-verify/         # Verify completeness → verify.md
    └── flower-review/         # Review code quality → review.md
```

## `flower` Workflow

| Phase | Skill              | Purpose                           | Output           |
| ----- | ------------------ | --------------------------------- | ---------------- |
| 1     | `flower-propose`   | Capture and clarify requirements  | `requirement.md` |
| 2     | `flower-design`    | Create technical design           | `design.md`      |
| 3     | `flower-plan`      | Break down into tasks             | `plan.md`        |
| 4     | `flower-implement` | Execute tasks                     | Code changes     |
| 5     | `flower-verify`    | Verify completeness & correctness | `verify.md`      |
| 6     | `flower-review`    | Review code quality & security    | `review.md`      |

All outputs go to `.agents/flower/{YYMMDD-HHMM}--{short-desc}/`.

## Code Patterns

### CLI Commands

Commands use `citty` with dynamic imports for lazy loading:

```typescript
import { defineCommand } from "citty";

export default defineCommand({
  meta: { name: "setup", description: "..." },
  args: {
    force: { type: "boolean", alias: "f", default: false },
  },
  run: async ({ args }) => {
    /* implementation */
  },
});
```

Command registration in `commands/index.ts` uses dynamic imports:

```typescript
export default {
  setup: () => import("./setup").then((m) => m.default),
  doctor: () => import("./doctor").then((m) => m.default),
  version: () => import("./version").then((m) => m.default),
} as Record<string, () => Promise<CommandDef>>;
```

### Path Aliases

`tsconfig.json` defines path aliases:

- `$/*` → `./src/*`
- `$lib/*` → `./src/lib/*`

Import example: `import { SKILLS_DIR } from "$lib/constants";`

### File System Utilities

The CLI uses Node.js `fs` APIs wrapped in `lib/fs.ts`, NOT Bun's file APIs directly:

```typescript
// lib/fs.ts uses node:fs, node:crypto, glob
export const hasContent = (dir: string): boolean => { ... };
export const hashFile = async (path: string): Promise<string> => { ... };
export const listFiles = (dir: string): string[] => { ... };
export const copyDir = (src: string, dest: string) => { ... };
```

### Prompts with @clack/prompts

CLI uses `@clack/prompts` for interactive prompts:

```typescript
import { intro, outro, spinner, log, confirm } from "@clack/prompts";

intro("flower setup");
const s = spinner();
s.start("Copying skills...");
// ... work ...
s.stop("Skills copied");
outro("Ready!");
```

## Skills Structure

Each skill follows the [agentskills.io](https://agentskills.io) specification:

```
skill-name/
├── SKILL.md                    # Instructions (YAML frontmatter + markdown)
│   ---
│   name: skill-name
│   description: What this skill does. Use when X. Triggers on Y.
│   ---
│   # Skill instructions in markdown
└── assets/
    └── templates/              # Output templates (optional)
        └── *.md                # Templates with YAML frontmatter
```

### Skill YAML Frontmatter

Required fields in SKILL.md frontmatter:

```yaml
---
name: flower-example
description: What this skill does. Use when condition. Triggers on keywords.
---
```

The `description` field is critical—it determines when the skill triggers. Format: `"What it does. Use when [condition]. Triggers on [keywords]."`

### Template Structure

Templates use YAML frontmatter for metadata:

```yaml
---
title: ""
type: feature
createdAt: YYYY-MM-DD HH:MM
---
```

## Key Files Reference

| File                                | Purpose                                                         |
| ----------------------------------- | --------------------------------------------------------------- |
| `packages/cli/src/lib/constants.ts` | `SKILLS_DIR`, `TARGET_DIR` (`.agents`), `EXPECTED_SKILLS` array |
| `packages/cli/src/lib/paths.ts`     | Path resolution for source and target skill directories         |
| `packages/cli/src/lib/fs.ts`        | File system utilities using Node.js APIs                        |
| `packages/cli/src/lib/package.ts`   | Package.json reader with caching                                |
| `packages/cli/src/utils/error.ts`   | Error message extraction utility                                |

## Development Workflow

### Skills Development

1. **Source of truth**: `skills/` directory at repo root
2. **During development**: Copy skills to `packages/cli/skills/` for testing
3. **At build time**: Skills in `packages/cli/skills/` are bundled into the npm package
4. **At runtime**: CLI copies skills from bundle to target project's `.agents/skills/`

### Build Process

```
1. Skills must exist in packages/cli/skills/ before build
2. bun run build → outputs to dist/ (Node.js target for compatibility)
3. npm publish includes dist/ and skills/ directories
```

The CLI targets **Node.js** (not Bun runtime) for wider compatibility with users who don't have Bun installed.

## Publishing

The `publish:cli` script (`scripts/publish-cli.ts`) handles the full release:

1. Parses `--major/--minor/--patch` argument
2. Bumps version in `packages/cli/package.json`
3. Builds the CLI to `dist/`
4. Publishes to npm with `--access public`
5. Commits the version change with message `release(cli): v{version}`

## Important Conventions

### Error Handling

Use the utility in `utils/error.ts` for consistent error messages:

```typescript
import { getErrorMessage } from "$/utils/error";

try {
  // ...
} catch (e) {
  log.error(getErrorMessage(e));
  process.exit(1);
}
```

### Doctor Command Checks

The `doctor` command performs 4 checks with pass/warn/fail status:

1. **Directory**: Does `.agents/skills/` exist?
2. **Skills**: Are all 6 expected skills present?
3. **SKILL.md**: Does each skill have a SKILL.md file?
4. **Integrity**: Have any files been modified from original? (uses SHA256 hashes)

### Constants

All shared constants live in `lib/constants.ts`:

- `SKILLS_DIR = "skills"`
- `TARGET_DIR = ".agents"`
- `EXPECTED_SKILLS = ["flower-design", "flower-plan", "flower-propose", "flower-review", "flower-implement", "flower-verify"]`

## Dependencies

### Production

- `citty` - CLI framework with subcommands
- `@clack/prompts` - Interactive prompts
- `glob` - File globbing

### Development

- `bun` - Runtime and package manager
- `typescript` - Type checking
- `@types/bun`, `@types/node` - Type definitions

## Gotchas

1. **Skills must be copied before build**: The CLI bundle includes skills from `packages/cli/skills/`, not from the root `skills/` directory. Always sync before building.

2. **Node.js target**: The CLI builds with `--target node` for compatibility, even though development uses Bun.

3. **Path resolution**: Skills source directory is resolved relative to the compiled file location using `import.meta.url`.

4. **Package version caching**: `getPackageInfo()` caches the result—intentional for CLI runtime, but be aware during testing.

5. **No tests currently**: The project has no test suite yet. Test manually via `bun run dev`.

6. **Bun-only scripts**: The publish script uses `bun` APIs (`$` template literal for shell commands) and won't run with Node.
