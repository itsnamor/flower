import { dirname, join } from "node:path";
import { pathExists } from "./fs";
import {
  SKILLS_DIR,
  TARGET_DIR,
  COMMANDS_DIR,
  COMMANDS_TARGET_SUBDIR,
  TEMPLATES_DIR,
} from "../constants";

const CORE_DIR = "core";

function findPackageRoot(): string {
  let current = import.meta.dirname;
  while (current !== dirname(current)) {
    const candidate = join(current, "package.json");
    if (pathExists(candidate)) return current;
    current = dirname(current);
  }
  throw new Error("Unable to resolve package root");
}

const packageRoot = findPackageRoot();

export function getSkillsSourceDir(): string {
  return join(packageRoot, CORE_DIR, SKILLS_DIR);
}

export function getTargetSkillsDir(cwd: string): string {
  return join(cwd, TARGET_DIR, SKILLS_DIR);
}

export function getCommandsSourceDir(): string {
  return join(packageRoot, CORE_DIR, COMMANDS_DIR);
}

export function getTargetCommandsDir(cwd: string): string {
  return join(cwd, TARGET_DIR, COMMANDS_TARGET_SUBDIR);
}

export function getTemplatesSourceDir(): string {
  return join(packageRoot, CORE_DIR, TEMPLATES_DIR);
}
