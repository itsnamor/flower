---
status: completed
---

## 1. Summary

Made `@itsflower/cli@0.1.0` publish-ready for npmjs.com. Replaced Bun-specific APIs (`Bun.write`, `Bun.file`, `import.meta.dir`) with Node.js-compatible equivalents (`readFile`/`writeFile` from `node:fs/promises`, `dirname(fileURLToPath(import.meta.url))`), so the CLI runs on both Node.js and Bun. Added a tsup build step that compiles TypeScript to a single ESM bundle at `dist/main.js` with a `#!/usr/bin/env node` shebang. Configured package.json with `bin`, `files`, `publishConfig.access: "public"`, version `0.1.0`, and standard metadata. Added README.md and MIT LICENSE. One deviation from plan: `templates/` is a symlink to `../../core/templates`, which npm pack silently skips — resolved with `prepack`/`postpack` scripts that swap the symlink for real files during packaging.

## 2. Quality Checklist

- [x] Dead code & unused files removed — no commented-out code, unused imports, or debug statements; `console.log` calls are intentional CLI output
- [x] Project standards followed — ESM module, TypeScript source, consistent with existing codebase patterns
- [x] No security issues — no hardcoded secrets, no user input used in file paths beyond `process.cwd()`, template copying uses safe `readFile`/`writeFile`
- [x] Performance acceptable — copies 4 small markdown files sequentially; no performance concerns at this scale
- [x] All tests pass — no test suite exists; `tsc --noEmit` passes, `bun run build` succeeds, `node dist/main.js --help` runs correctly, `npm pack --dry-run` shows all 8 expected files
- [x] Documentation up to date — README.md created with install/usage instructions for both `npx` and `bunx`

## 3. Memories

### npm pack silently skips symlinked directories

- **content**: When `files` in package.json includes a symlinked directory, `npm pack` silently excludes it from the tarball with no warning. The fix is to use `prepack` and `postpack` lifecycle scripts: `prepack` replaces the symlink with a real copy (`rm -f <link> && cp -r <target> <link>`), and `postpack` restores the symlink (`rm -rf <dir> && ln -s <target> <link>`). This is a known npm limitation.
- **tags**: npm, publishing, symlinks, packaging, prepack
- **scope**: global

### tsup preserves shebangs in CLI builds

- **content**: When building a CLI with `tsup src/main.ts --format esm --shims`, tsup automatically preserves the `#!/usr/bin/env node` shebang from the source file in the output bundle. No additional configuration needed. The `--shims` flag handles `__dirname`/`import.meta.url` interop.
- **tags**: tsup, cli, bundling, shebang, esm
- **scope**: global
