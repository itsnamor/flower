---
status: completed
---

## 1. Overview

Make `@itsflower/cli` publishable to npm and runnable via both `npx` and `bunx`. Replace Bun-specific APIs with Node.js-compatible equivalents, add a tsup build step to compile TypeScript to JavaScript, and configure the package.json with proper npm metadata. Version set to `0.1.0` for the first public release.

## 2. Technical Decisions

- **tsup as bundler**: Zero-config TypeScript bundler powered by esbuild. Supports ESM output, shims for `import.meta.url`/`__dirname` interop, and is widely used for CLI tools. Keeps the build simple with no config file needed.
  - Alternatives considered: unbuild → heavier, designed for libraries not CLIs; raw `tsc` → no bundling, would require shipping all node_modules; `bun build` → ties the build to Bun
- **Node.js `fs` APIs instead of Bun APIs**: Replace `Bun.file()`/`Bun.write()` with `readFile`/`writeFile` from `node:fs/promises`, and `import.meta.dir` with `dirname(fileURLToPath(import.meta.url))`. These work on both Node.js and Bun.
- **`#!/usr/bin/env node` shebang**: Ensures the binary works when invoked via `npx`. Bun also respects `#!/usr/bin/env node` when running via `bunx`, so this is universally compatible.
- **MIT license**: Standard open-source license, matches the ecosystem conventions.
- **Version `0.1.0`**: Follows semver — `0.1.0` signals first development release. `0.0.1` is too early for a published package.

## 3. Tasks

### Source compatibility

- [x] **Task 1**: Replace Bun-specific APIs with Node.js-compatible equivalents in `src/main.ts`
  - AC:
    - `import.meta.dir` replaced with `dirname(fileURLToPath(import.meta.url))`
    - `Bun.file()` / `Bun.write()` replaced with `readFile` / `writeFile` from `node:fs/promises`
    - Shebang changed from `#!/usr/bin/env bun` to `#!/usr/bin/env node`
    - No Bun-specific imports remain (`@types/bun` stays as devDep only)
    - File still compiles with `tsc --noEmit`
  - Approach: Edit `packages/cli/src/main.ts`. Import `fileURLToPath` from `node:url`, `dirname` from `node:path`. Replace line 12 (`import.meta.dir`) with `dirname(fileURLToPath(import.meta.url))`. Replace line 21 (`Bun.write(dest, Bun.file(src))`) with `writeFile(dest, await readFile(src))`. Add `readFile`, `writeFile` to the `node:fs/promises` import. Change shebang on line 1.

### Build pipeline

- [x] **Task 2**: Add tsup as a dev dependency and create a build script
  - AC:
    - `tsup` is in `devDependencies`
    - `scripts.build` runs `tsup src/main.ts --format esm --shims`
    - Running `bun run build` produces `dist/main.js` with the node shebang preserved
  - Approach: Run `cd packages/cli && bun add -d tsup`. Add `"scripts": { "build": "tsup src/main.ts --format esm --shims" }` to `packages/cli/package.json`.
  - Blocked by: Task 1

### Package metadata

- [x] **Task 3**: Update `package.json` with npm publishing fields
  - AC:
    - `bin` points to `./dist/main.js`
    - `files` includes `dist` and `templates`
    - `publishConfig.access` is `"public"`
    - `version` is `0.1.0`
    - `description`, `license`, `keywords`, `repository` fields are set
  - Approach: Edit `packages/cli/package.json`. Set `bin.flower` to `./dist/main.js`. Add `files: ["dist", "templates"]`. Add `publishConfig: { "access": "public" }`. Update `version` to `0.1.0`. Add `description: "🌸 flower CLI — scaffold structured development workflows"`, `license: "MIT"`, `keywords: ["flower", "workflow", "cli", "templates"]`, `repository: { "type": "git", "url": "https://github.com/itsflower/flower" }`.
  - Blocked by: Task 2

- [x] **Task 4**: Add a README.md to the CLI package
  - AC:
    - `packages/cli/README.md` exists
    - Contains: package name, one-line description, install/usage instructions for both npx and bunx, brief description of `init` command
  - Approach: Create `packages/cli/README.md` with usage examples showing `npx @itsflower/cli init` and `bunx @itsflower/cli init`.

- [x] **Task 5**: Add an MIT LICENSE file to the CLI package
  - AC:
    - `packages/cli/LICENSE` exists with MIT license text
  - Approach: Create `packages/cli/LICENSE` with standard MIT license text.

### Verification

- [x] **Task 6**: Build, pack, and verify the package is publish-ready
  - AC:
    - `bun run build` succeeds and produces `dist/main.js`
    - `npm pack` in `packages/cli/` creates a tarball containing only: `dist/main.js`, `templates/` (4 files), `package.json`, `README.md`, `LICENSE`
    - No `.ts` source files in the tarball
    - `node dist/main.js --help` prints usage info without errors
  - Approach: Run `bun run build` in `packages/cli/`. Run `npm pack --dry-run` to inspect contents. Run `node dist/main.js --help` to verify runtime compatibility.
  - Blocked by: Task 1, 2, 3, 4, 5

## 4. Dependencies

### External Dependencies

- `tsup` — TypeScript bundler (new dev dependency)

## 5. Risks & Mitigation

- **Risk**: Templates not found at runtime after bundling — path resolution differs between source and dist
  - Impact: `flower init` crashes with file-not-found error
  - Mitigation: The relative path `../templates` from `dist/main.js` resolves to `packages/cli/templates/` — same as from `src/main.ts`. Verified by the directory structure. Task 6 explicitly tests this.
