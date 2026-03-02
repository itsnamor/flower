---
status: completed
---

## 1. Summary

Replaced manual `process.argv` parsing and `@clack/prompts` with `citty` in `@itsflower/cli`. The CLI now uses `defineCommand`/`runMain` for structured command definition with auto-generated help/usage output. The `init` subcommand is preserved with equivalent behavior. `@clack/prompts` has been fully removed from dependencies.

## 2. Quality Checklist

- [x] Dead code & unused files removed
- [x] Project standards followed (style, structure, patterns, linting)
- [x] No security issues (secrets, injection, auth bypass, etc.)
- [x] Performance acceptable — N/A (simple CLI entry point)
- [x] All tests pass — no test suite exists; manual verification passed
- [x] Documentation up to date — no user-facing docs exist; skip

## 3. Memories

### Citty uses subCommands object for nested CLI commands
- **content**: In citty, subcommands are registered via a `subCommands` property on the parent command's `defineCommand` call. Each subcommand is itself a `defineCommand` result. `runMain` handles argument parsing, help generation, and error handling automatically.
- **tags**: citty, cli, unjs, subcommands
- **scope**: project:flower
