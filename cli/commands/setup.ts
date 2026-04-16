import { defineCommand } from "citty";
import { intro, outro, spinner, log, confirm } from "@clack/prompts";

import { SKILLS_DIR, TARGET_DIR, COMMANDS_TARGET_SUBDIR } from "../constants";
import {
  getSkillsSourceDir,
  getTargetSkillsDir,
  getCommandsSourceDir,
  getTargetCommandsDir,
} from "$utils/paths";
import { hasContent, listSkills, copyDir, pathExists } from "$utils/fs";

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
  async run({ args }) {
    const targetSkillsDir = getTargetSkillsDir(process.cwd());
    const sourceSkillsDir = getSkillsSourceDir();
    const targetCommandsDir = getTargetCommandsDir(process.cwd());
    const sourceCommandsDir = getCommandsSourceDir();

    intro("🌸 flower setup");

    if (!hasContent(sourceSkillsDir)) {
      log.error("Skills not found. CLI installation may be corrupted.");
      process.exit(1);
    }

    const hasSetup = hasContent(targetSkillsDir) || pathExists(targetCommandsDir);

    if (hasSetup && !args.force) {
      log.warn("flower is already set up.");
      const shouldOverwrite = await confirm({
        message: "Overwrite existing?",
        initialValue: false,
      });
      if (!shouldOverwrite) {
        return outro("Setup cancelled.");
      }
    }

    const s = spinner();
    const skills = listSkills(sourceSkillsDir);

    s.start("Copying skills...");
    copyDir(sourceSkillsDir, targetSkillsDir);
    s.stop(`${skills.length} skills → ${TARGET_DIR}/${SKILLS_DIR}/`);

    if (pathExists(sourceCommandsDir)) {
      s.start("Copying commands...");
      copyDir(sourceCommandsDir, targetCommandsDir);
      s.stop(`commands → ${TARGET_DIR}/${COMMANDS_TARGET_SUBDIR}/`);
    }

    outro("Run 'flower doctor' to verify.");
  },
});
