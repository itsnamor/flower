import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const pkgPath = resolve(root, "packages/cli/package.json");
const mainTsPath = resolve(root, "packages/cli/src/main.ts");
const cliDir = resolve(root, "packages/cli");

type BumpType = "major" | "minor" | "patch";

const bumpType = (["major", "minor", "patch"] as const).find((flag) =>
  Bun.argv.includes(`--${flag}`)
) as BumpType | undefined;

if (!bumpType) {
  console.error("Usage: bun release --major | --minor | --patch");
  process.exit(1);
}

function bump(version: string, type: BumpType): string {
  const [major, minor, patch] = version.split(".").map(Number);
  switch (type) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
  }
}

async function run(cmd: string[], cwd?: string) {
  console.log(`$ ${cmd.join(" ")}`);
  const proc = Bun.spawn(cmd, { cwd, stdio: ["inherit", "inherit", "inherit"] });
  const code = await proc.exited;
  if (code !== 0) {
    console.error(`Command failed with exit code ${code}`);
    process.exit(code);
  }
}

const pkg = JSON.parse(await readFile(pkgPath, "utf-8"));
const oldVersion = pkg.version;
const newVersion = bump(oldVersion, bumpType);

pkg.version = newVersion;
await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`Bumped package.json: ${oldVersion} → ${newVersion}`);

const mainTs = await readFile(mainTsPath, "utf-8");
const updatedMainTs = mainTs.replace(
  /version:\s*"[^"]+"/,
  `version: "${newVersion}"`
);
await writeFile(mainTsPath, updatedMainTs);
console.log(`Synced main.ts version: ${newVersion}`);

await run(["bun", "run", "build"], cliDir);

await run(["npm", "publish"], cliDir);

await run(["git", "add", "."], root);
await run(["git", "commit", "-m", `release: v${newVersion}`], root);
await run(["git", "tag", `v${newVersion}`], root);

console.log(`\n🌸 Released v${newVersion}`);
