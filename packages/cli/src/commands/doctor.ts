import { defineCommand } from "citty";
import { intro, outro, log } from "@clack/prompts";
import { join } from "node:path";

import {
  SKILLS_DIR,
  TARGET_DIR,
  COMMANDS_TARGET_SUBDIR,
  EXPECTED_SKILLS,
  EXPECTED_COMMANDS,
} from "$lib/constants";
import {
  getSkillsSourceDir,
  getTargetSkillsDir,
  getTargetCommandsDir,
} from "$lib/paths";
import { hasContent, listFiles, hashFile, pathExists } from "$lib/fs";

type Status = "pass" | "warn" | "fail";

const icons = { pass: "✓", warn: "▲", fail: "✗" };

const check = (label: string, status: Status, message?: string): Status => {
  const logFn = { pass: log.success, warn: log.warn, fail: log.error };
  const text = message ? `${label}: ${message}` : label;
  logFn[status](`${icons[status]} ${text}`);
  return status;
};

const checkSkills = (targetDir: string): Status => {
  const missing = EXPECTED_SKILLS.filter((s) => !pathExists(join(targetDir, s)));
  const missingMd = EXPECTED_SKILLS.filter((s) => !pathExists(join(targetDir, s, "SKILL.md")));

  if (!pathExists(targetDir)) {
    return check("skills", "fail", `${TARGET_DIR}/${SKILLS_DIR} not found`);
  }
  if (missing.length > 0) {
    return check("skills", "fail", `missing: ${missing.join(", ")}`);
  }
  if (missingMd.length > 0) {
    return check("skills", "fail", `missing SKILL.md in: ${missingMd.join(", ")}`);
  }
  return check("skills", "pass", `${EXPECTED_SKILLS.length} skills ready`);
};

const checkCommands = (targetDir: string): Status => {
  if (!pathExists(targetDir)) {
    return check("commands", "warn", "not found");
  }
  const missing = EXPECTED_COMMANDS.filter((c) => !pathExists(join(targetDir, c)));
  if (missing.length > 0) {
    return check("commands", "warn", `missing: ${missing.join(", ")}`);
  }
  return check("commands", "pass", "all commands present");
};

const checkIntegrity = async (targetDir: string, sourceDir: string): Promise<Status> => {
  const modified: string[] = [];

  for (const f of listFiles(targetDir)) {
    const targetPath = join(targetDir, f);
    const sourcePath = join(sourceDir, f);

    if (!pathExists(sourcePath)) {
      modified.push(f);
      continue;
    }

    const targetHash = await hashFile(targetPath);
    const sourceHash = await hashFile(sourcePath);
    if (targetHash !== sourceHash) {
      modified.push(f);
    }
  }

  if (modified.length === 0) return check("integrity", "pass", "all files match original");
  if (modified.length <= 3) return check("integrity", "warn", `modified: ${modified.join(", ")}`);
  return check("integrity", "fail", `${modified.length} files modified`);
};

export default defineCommand({
  meta: { name: "doctor", description: "Check flower setup integrity" },
  run: async () => {
    const targetSkillsDir = getTargetSkillsDir(process.cwd());
    const sourceSkillsDir = getSkillsSourceDir();
    const targetCommandsDir = getTargetCommandsDir(process.cwd());

    intro("🌸 flower doctor");

    if (!hasContent(sourceSkillsDir)) {
      log.error("Skills not found. CLI installation may be corrupted.");
      process.exit(1);
    }

    const results: Status[] = [];

    results.push(checkSkills(targetSkillsDir));
    results.push(checkCommands(targetCommandsDir));
    results.push(await checkIntegrity(targetSkillsDir, sourceSkillsDir));

    if (results.includes("fail")) {
      outro("Run 'flower setup --force' to fix.");
      process.exit(1);
    }

    outro(results.includes("warn") ? "Setup has warnings." : "All checks passed.");
  },
});
