#!/usr/bin/env bun
/**
 * Publish CLI script
 * Usage: bun run publish:cli --minor/--major/--patch
 */

import { $ } from "bun";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const CLI_PACKAGE_PATH = resolve(import.meta.dir, "../packages/cli/package.json");

type VersionBump = "major" | "minor" | "patch";

function parseArgs(): VersionBump {
  const args = process.argv.slice(2);
  const bumpArg = args.find((arg) => arg.startsWith("--"));

  if (!bumpArg) {
    console.error("Error: Missing version bump argument");
    console.error("Usage: bun run publish:cli --minor/--major/--patch");
    process.exit(1);
  }

  const bump = bumpArg.replace("--", "") as VersionBump;

  if (!["major", "minor", "patch"].includes(bump)) {
    console.error(`Error: Invalid version bump "${bump}"`);
    console.error("Valid options: --major, --minor, --patch");
    process.exit(1);
  }

  return bump;
}

function bumpVersion(currentVersion: string, bump: VersionBump): string {
  const [major, minor, patch] = currentVersion.split(".").map(Number);

  switch (bump) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
  }
}

async function main() {
  const bump = parseArgs();

  // Read current package.json
  const packageJson = JSON.parse(readFileSync(CLI_PACKAGE_PATH, "utf-8"));
  const currentVersion = packageJson.version;
  const newVersion = bumpVersion(currentVersion, bump);

  console.log(`Bumping version: ${currentVersion} → ${newVersion}`);

  // Update version in package.json
  packageJson.version = newVersion;
  writeFileSync(CLI_PACKAGE_PATH, JSON.stringify(packageJson, null, 2) + "\n");

  // Build CLI
  console.log("\nBuilding CLI...");
  await $`bun run build`.cwd(resolve(import.meta.dir, "../packages/cli"));

  // Publish to npm
  console.log("\nPublishing to npm...");
  await $`npm publish --access public`.cwd(resolve(import.meta.dir, "../packages/cli"));

  // Commit changes
  console.log("\nCommitting changes...");
  const rootDir = resolve(import.meta.dir, "..");
  const commitMessage = `release(cli): v${newVersion}`;
  await $`git add packages/cli/package.json`.cwd(rootDir);
  await $`git commit -m ${commitMessage}`.cwd(rootDir);

  console.log(`\n✓ Published @itsflower/cli@${newVersion}`);
}

main().catch((err) => {
  console.error("Publish failed:", err);
  process.exit(1);
});
