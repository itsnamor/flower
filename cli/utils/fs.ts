import { cpSync, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { globSync } from "glob";

export function hasContent(dir: string): boolean {
  return existsSync(dir) && readdirSync(dir).length > 0;
}

export function hashFile(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function listFiles(dir: string): string[] {
  return globSync("**/*", { cwd: dir, nodir: true });
}

export function listSkills(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => statSync(join(dir, f)).isDirectory());
}

export function listMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
}

export function listDirectories(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => statSync(join(dir, f)).isDirectory()).sort();
}

export function pathExists(path: string): boolean {
  return existsSync(path);
}

export function isDirectory(path: string): boolean {
  return existsSync(path) && statSync(path).isDirectory();
}

export function copyDir(src: string, dest: string): void {
  cpSync(src, dest, { recursive: true, dereference: true });
}

export function readTextFile(path: string): string {
  return readFileSync(path, "utf-8");
}
