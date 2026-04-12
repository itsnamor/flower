# @flowrr/cli

[![npm version](https://img.shields.io/npm/v/@flowrr/cli.svg)](https://www.npmjs.com/package/@flowrr/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

CLI for Flower — scaffold structured development workflows in your project.

## Features

- ✅ **Setup** — Initialize Flower in any project with a single command.
- ✅ **Doctor** — Validate your setup integrity and troubleshooting.
- ✅ **Multi-runtime** — First-class support for Bun, Node.js, and Pnpm.

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) 1.0+, Node.js 18+, or Pnpm 8+

### Installation

```bash
# Using bun (recommended)
bun add -g @flowrr/cli

# Using npm
npm install -g @flowrr/cli

# Using pnpm
pnpm add -g @flowrr/cli
```

### Basic Usage

```bash
flower [command] [options]
```

## Commands

| Command   | Description                             |
| --------- | --------------------------------------- |
| `setup`   | Initialize Flower in your project       |
| `doctor`  | Check Flower setup integrity and health |
| `version` | Display the current CLI version         |
| `--help`  | Show help for any command               |

### `setup`

Initializes the Flower environment in your current working directory.

```bash
flower setup [options]

# Options
-f, --force    Force setup even if already initialized
```

### `doctor`

Runs a diagnostic check on your local Flower configuration to ensure everything is wired correctly.

```bash
flower doctor
```

## Examples

```bash
# Initialize a new project
flower setup

# Verify installation health
flower doctor

# Show version
flower version
```

## Support

- 🐛 [Issue Tracker](https://github.com/itsflower/flower/issues)
- 📖 [Documentation](https://itsflower.dev)

## License

MIT
