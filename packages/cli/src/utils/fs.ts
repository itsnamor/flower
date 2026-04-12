import { existsSync, readdirSync, readFileSync, statSync, cpSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

export const SKILLS_DIR = "skills";
export const TARGET_DIR = ".agents";

export const EXPECTED_SKILLS = [
  "flower-design",
  "flower-plan",
  "flower-propose",
  "flower-review",
  "flower-implement",
  "flower-verify",
];

const packageDir = resolve(fileURLToPath(import.meta.url), "../..");
export const getSkillsSourceDir = () => join(packageDir, SKILLS_DIR);
export const getTargetSkillsDir = (cwd: string) => join(cwd, TARGET_DIR, SKILLS_DIR);

export const hasContent = (dir: string) => existsSync(dir) && readdirSync(dir).length > 0;

export const hashFile = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

export const listFiles = (dir: string, base: string = dir): string[] => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((item) => {
    const path = join(dir, item);
    return statSync(path).isDirectory() ? listFiles(path, base) : [relative(base, path)];
  });
};

export const copyDir = (src: string, dest: string) =>
  cpSync(src, dest, { recursive: true, dereference: true });
