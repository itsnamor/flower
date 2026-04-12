import { defineCommand } from "citty";
import { intro, outro, spinner, log, confirm } from "@clack/prompts";
import { SKILLS_DIR, TARGET_DIR, getSkillsSourceDir, getTargetSkillsDir, hasContent, listFiles, copyDir } from "$/utils/fs";

export default defineCommand({
  meta: { name: "setup", description: "Set up Flower in your project" },
  args: {
    force: {
      type: "boolean",
      alias: "f",
      description: "Force setup even if already initialized",
      default: false,
    },
  },
  run: async ({ args }) => {
    const targetDir = getTargetSkillsDir(process.cwd());
    const sourceDir = getSkillsSourceDir();

    intro("Flower Setup");

    if (!hasContent(sourceDir)) {
      log.error("Skills not found. CLI installation may be corrupted.");
      process.exit(1);
    }

    if (hasContent(targetDir) && !args.force) {
      log.warn("Flower is already set up. Use --force to overwrite.");
      if (!(await confirm({ message: "Force overwrite?", initialValue: false }))) {
        return outro("Setup cancelled");
      }
    }

    const s = spinner();
    s.start("Copying skills...");
    try {
      copyDir(sourceDir, targetDir);
      s.stop("Skills copied");
    } catch (e) {
      s.stop("Copy failed");
      log.error(e instanceof Error ? e.message : String(e));
      process.exit(1);
    }

    log.success(`${listFiles(targetDir).length} files → ${TARGET_DIR}/${SKILLS_DIR}/`);
    log.info("Run 'flower doctor' to verify");
    outro("Ready!");
  },
});
