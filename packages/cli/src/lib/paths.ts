import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SKILLS_DIR, TARGET_DIR } from "./constants";

const packageDir = dirname(dirname(fileURLToPath(import.meta.url)));

export const getSkillsSourceDir = () => join(packageDir, "dist", SKILLS_DIR);
export const getTargetSkillsDir = (cwd: string) => join(cwd, TARGET_DIR, SKILLS_DIR);
