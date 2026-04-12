# @flowrr/cli

🌸 CLI for flower - scaffold structured development workflows in your project.

## Installation

```bash
npm install -g @flowrr/cli
# or
yarn global add @flowrr/cli
# or
bun install -g @flowrr/cli
```

## Usage

```bash
flower <command> [options]
```

## Commands

### `flower setup`

Set up Flower in your project. Copies the skill files to `.agents/skills/` in your project directory.

```bash
flower setup
```

**Options:**

- `-f, --force` - Force setup even if already initialized (will overwrite existing files)

### `flower doctor`

Check Flower setup integrity. Verifies that all expected skills are present and haven't been modified.

```bash
flower doctor
```

Checks:

- Directory structure (`.agents/skills/` exists)
- All expected skills are present
- All skills have a `SKILL.md` file
- File integrity (compares against original files)

### `flower version`

Display the current version.

```bash
flower version
```

## What is flower?

`flower` is a structured development workflow system that provides AI-assisted skills for:

- **flower-design** - Design and architecture planning
- **flower-plan** - Task planning and breakdown
- **flower-propose** - Propose solutions and approaches
- **flower-review** - Code and design review
- **flower-implement** - Implementation guidance
- **flower-verify** - Verification and testing

When you run `flower setup`, these skills are copied to your project's `.agents/skills/` directory where they can be used by AI assistants.

## Directory Structure

After running `flower setup`, your project will have:

```
your-project/
├── .agents/
│   └── skills/
│       ├── flower-design/
│       │   └── SKILL.md
│       ├── flower-plan/
│       │   ├── SKILL.md
│       │   └── assets/
│       ├── flower-propose/
│       │   ├── SKILL.md
│       │   └── assets/
│       ├── flower-review/
│       │   ├── SKILL.md
│       │   └── assets/
│       ├── flower-implement/
│       │   └── SKILL.md
│       └── flower-verify/
│           ├── SKILL.md
│           └── assets/
└── ...
```

## Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev

# Build for production
bun run build

# Type check
bun run typecheck
```

## License

MIT
