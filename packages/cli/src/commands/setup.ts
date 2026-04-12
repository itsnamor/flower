import { defineCommand } from "citty";
import { intro, outro, spinner, log, confirm } from "@clack/prompts";

import { SKILLS_DIR, TARGET_DIR, COMMANDS_TARGET_SUBDIR } from "$lib/constants";
import {
  getSkillsSourceDir,
  getTargetSkillsDir,
  getCommandsSourceDir,
  getTargetCommandsDir,
} from "$lib/paths";
import { hasContent, listSkills, copyDir, pathExists } from "$lib/fs";
import { getErrorMessage } from "$/utils/error";

export default defineCommand({
  meta: { name: "setup", description: "Set up flower in your project" },
  args: {
    force: {
      type: "boolean",
      alias: "f",
      description: "Overwrite existing setup",
      default: false,
    },
  },
  run: async ({ args }) => {
    const targetSkillsDir = getTargetSkillsDir(process.cwd());
    const sourceSkillsDir = getSkillsSourceDir();
    const targetCommandsDir = getTargetCommandsDir(process.cwd());
    const sourceCommandsDir = getCommandsSourceDir();

    intro("🌸 flower setup");

    if (!hasContent(sourceSkillsDir)) {
      log.error("Skills not found. CLI installation may be corrupted.");
      process.exit(1);
    }

    const hasSkills = hasContent(targetSkillsDir);
    const hasCommands = pathExists(targetCommandsDir);

    if ((hasSkills || hasCommands) && !args.force) {
      log.warn("flower is already set up.");

      if (!(await confirm({ message: "Overwrite existing?", initialValue: false }))) {
        return outro("Setup cancelled.");
      }
    }

    const s = spinner();
    s.start("Copying skills...");

    try {
      copyDir(sourceSkillsDir, targetSkillsDir);
      s.stop("✓ Skills copied");
    } catch (e) {
      s.stop("✗ Failed to copy skills");
      log.error(getErrorMessage(e));
      process.exit(1);
    }

    if (pathExists(sourceCommandsDir)) {
      s.start("Copying commands...");
      try {
        copyDir(sourceCommandsDir, targetCommandsDir);
        s.stop("✓ Commands copied");
      } catch (e) {
        s.stop("✗ Failed to copy commands");
        log.error(getErrorMessage(e));
        process.exit(1);
      }
    }

    const skills = listSkills(targetSkillsDir);
    log.success(`${skills.length} skills → ${TARGET_DIR}/${SKILLS_DIR}/`);
    if (pathExists(targetCommandsDir)) {
      log.success(`commands → ${TARGET_DIR}/${COMMANDS_TARGET_SUBDIR}/`);
    }
    outro("Run 'flower doctor' to verify.");
  },
});
