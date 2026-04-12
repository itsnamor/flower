# Flower

CLI tool that scaffolds structured development workflows in any project.

## Project Overview

Flower is a CLI (`@itsflower/cli`) that copies workflow skills to a target project's `.agents/skills/` directory. These skills guide agents through a structured development process: propose → design → plan → implement → verify → review.

## Commands

### CLI Package (`packages/cli`)

```bash
# Development
bun run dev                    # Run CLI locally

# Build
bun run build                  # Build to dist/

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
│   │   ├── main.ts            # Entry point, uses citty
│   │   ├── commands/          # CLI commands (setup, doctor, version)
│   │   ├── lib/               # Utilities (paths, fs, constants)
│   │   └── utils/             # Helper functions
│   └── skills/                # Skills bundled with CLI (copied at build)
│
└── skills/                    # Source skills (copied to packages/cli during development)
    ├── flower-propose/        # Capture requirements
    ├── flower-design/         # Create technical design
    ├── flower-plan/           # Break down into tasks
    ├── flower-implement/      # Execute implementation
    ├── flower-verify/         # Verify completeness
    └── flower-review/         # Review code quality
```

## Flower Workflow

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

Commands use `citty` with dynamic imports:

```typescript
import { defineCommand } from "citty";

export default defineCommand({
  meta: { name: "setup", description: "..." },
  args: { force: { type: "boolean", alias: "f", default: false } },
  run: async ({ args }) => {
    /* implementation */
  },
});
```

Command registration in `commands/index.ts`:

```typescript
export default {
  setup: () => import("./setup").then((m) => m.default),
  // ...
} as Record<string, () => Promise<CommandDef>>;
```

### Path Aliases

tsconfig.json defines aliases:

- `$/*` → `./src/*`
- `$lib/*` → `./src/lib/*`

Import example: `import { SKILLS_DIR } from "$lib/constants";`

### Bun APIs

The codebase uses Bun-specific APIs:

- `Bun.Glob("*")` for file globbing
- `Bun.file(path)` for file reading
- `Bun.hash(content)` for file hashing

### Skills Structure

Each skill follows the agentskills.io spec:

```
skill-name/
├── SKILL.md          # Instructions (YAML frontmatter + markdown)
└── assets/
    └── templates/    # Output templates
```

## Key Files

- `packages/cli/src/lib/constants.ts` - `SKILLS_DIR`, `TARGET_DIR` (`.agents`), `EXPECTED_SKILLS`
- `packages/cli/src/lib/paths.ts` - Path resolution for source and target skill directories
- `packages/cli/src/lib/fs.ts` - File system utilities using Bun APIs

## Publishing

The `publish:cli` script handles the full release:

1. Bumps version in package.json
2. Builds the CLI
3. Publishes to npm
4. Commits the version change

## Development Notes

- Skills in `skills/` are the source of truth; they must be copied to `packages/cli/skills/` before building
- The CLI targets Node.js (not Bun runtime) for wider compatibility
- Templates use YAML frontmatter for metadata
- Each skill has a maximum of 4 clarification iterations
