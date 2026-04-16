import { cpSync, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { globSync } from "glob";

export const hasContent = (dir: string): boolean => {
  if (!existsSync(dir)) return false;
  return readdirSync(dir).length > 0;
};

export const hashFile = async (path: string): Promise<string> => {
  const content = readFileSync(path);
  return createHash("sha256").update(content).digest("hex");
};

export const listFiles = (dir: string): string[] =>
  globSync("**/*", { cwd: dir, nodir: true });

export const listSkills = (dir: string): string[] => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) =>
    statSync(join(dir, f)).isDirectory()
  );
};

export const pathExists = (path: string): boolean => existsSync(path);

export const isDirectory = (path: string): boolean => {
  if (!existsSync(path)) return false;
  return statSync(path).isDirectory();
};

export const copyDir = (src: string, dest: string) =>
  cpSync(src, dest, { recursive: true, dereference: true });
