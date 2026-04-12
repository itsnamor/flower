# flower

CLI tool that scaffolds structured development workflows in any project using AI agents.

[![npm version](https://badge.fury.io/js/%40flowrr%2Fcli.svg)](https://www.npmjs.com/package/@flowrr/cli)

`flower` is a CLI (`@flowrr/cli`) that copies workflow skills to a target project's `.agents/skills/` directory. These skills guide AI agents through a structured, software engineering-based development process: propose → design → plan → implement → verify → review.

## Features

- ✅ **Standardized AI Workflows:** Brings structured software engineering practices to AI coding agents.
- ✅ **Phase-by-Phase Execution:** Breaks down complex tasks into propose, design, plan, implement, verify, and review phases.
- ✅ **Local Skill Management:** Installs standard workflow skills directly into your project's `.agents/skills/` folder.
- ✅ **Project Agnostic:** Works with any codebase or language.

## Quick Start

### Prerequisites

- Node.js 18+
- An AI coding assistant that supports the [agentskills.io](https://agentskills.io) specification (like Crush).

### Installation & Setup

Install the CLI globally or run it via npx to scaffold the workflow skills into your current project:

```bash
# Initialize flower skills in your current project
npx @flowrr/cli setup
```

This will create an `.agents/skills/` directory in your project containing the necessary workflow skills.

## The Workflow

The `flower` workflow consists of six sequential skills designed to produce high-quality, verified code.

| Phase | Skill              | Purpose                                                        | Output           |
| ----- | ------------------ | -------------------------------------------------------------- | ---------------- |
| 1     | `flower-propose`   | Capture and clarify requirements from user input               | `requirement.md` |
| 2     | `flower-design`    | Create technical architecture and approach                     | `design.md`      |
| 3     | `flower-plan`      | Break down work into ordered tasks with acceptance criteria    | `plan.md`        |
| 4     | `flower-implement` | Execute tasks from the plan and write code                     | Code changes     |
| 5     | `flower-verify`    | Verify implementation completeness, correctness, and coherence | `verify.md`      |
| 6     | `flower-review`    | Review code quality, security, and project conventions         | `review.md`      |

_Note: All output markdown files are generated in `.agents/flower/{YYMMDD-HHMM}--{short-desc}/`._

### Basic Usage

Once installed, you can trigger the workflow by interacting with your AI agent using the trigger keywords defined in each skill.

1. **Start a new task:**
   Ask your agent: _"I want to add user authentication. Let's start the proposal phase."_ (Triggers `flower-propose`)

2. **Generate a design (for complex tasks):**
   Ask your agent: _"Create a technical design for the authentication requirement."_ (Triggers `flower-design`)

3. **Plan the implementation:**
   Ask your agent: _"Create an implementation plan based on the design."_ (Triggers `flower-plan`)

4. **Write the code:**
   Ask your agent: _"Implement the tasks from the plan."_ (Triggers `flower-implement`)

5. **Verify and Review:**
   Ask your agent: _"Verify the implementation."_ and then _"Review the code quality."_

## Architecture

The project is structured as a monorepo containing the CLI tool and the source of truth for the skills.

```
flower/
├── packages/cli/              # CLI package (@flowrr/cli)
│   ├── src/                   # CLI source code (citty framework)
│   └── skills/                # Bundled skills (copied during build)
└── skills/                    # Source skills (source of truth)
    ├── flower-propose/
    ├── flower-design/
    ├── flower-plan/
    ├── flower-implement/
    ├── flower-verify/
    └── flower-review/
```

## CLI Commands

- `setup`: Copies the flower skills into your project's `.agents/skills/` directory. Use `-f` or `--force` to overwrite existing skills.
- `doctor`: Checks your project to ensure skills are correctly installed and haven't been maliciously modified.

```bash
# Check installation health
npx @flowrr/cli doctor
```

## Troubleshooting

### Common Issues

**Error: Skills directory already exists**

If you try to run setup but the `.agents/skills` directory already contains files, the CLI will warn you to prevent overwriting custom changes.
**Fix:** Run the setup command with the force flag:

```bash
npx @flowrr/cli setup --force
```

**Doctor Command Warnings**

If `doctor` reports modified files or missing SKILL.md files, it means the installed skills differ from the official package.
**Fix:** Re-run the setup command with `--force` to restore the official skills.

## Development

See [AGENTS.md](AGENTS.md) for detailed development workflow, build processes, and architecture documentation.

1. **Source of Truth**: Always modify skills in the root `/skills/` directory.
2. **Testing**: Run `bun run dev` in `packages/cli` to test CLI changes locally.
3. **Building**: The CLI is built targeting Node.js using `bun run build`.

## License

MIT
