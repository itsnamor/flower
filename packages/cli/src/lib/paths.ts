import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SKILLS_DIR, TARGET_DIR, COMMANDS_DIR, COMMANDS_TARGET_SUBDIR, TEMPLATES_DIR } from "./constants";

const packageDir = dirname(dirname(fileURLToPath(import.meta.url)));

export const getSkillsSourceDir = () => join(packageDir, "dist", SKILLS_DIR);
export const getTargetSkillsDir = (cwd: string) => join(cwd, TARGET_DIR, SKILLS_DIR);

export const getCommandsSourceDir = () => join(packageDir, "dist", COMMANDS_DIR);
export const getTargetCommandsDir = (cwd: string) => join(cwd, TARGET_DIR, COMMANDS_TARGET_SUBDIR);

export const getTemplatesSourceDir = () => join(packageDir, "dist", TEMPLATES_DIR);
