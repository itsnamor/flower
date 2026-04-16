import { defineCommand } from "citty";
import { intro, outro, log } from "@clack/prompts";
import { join } from "node:path";

import { SKILLS_DIR, TARGET_DIR, EXPECTED_SKILLS, EXPECTED_COMMANDS } from "../constants";
import { getSkillsSourceDir, getTargetSkillsDir, getTargetCommandsDir } from "$utils/paths";
import { hasContent, listFiles, hashFile, pathExists } from "$utils/fs";

type Status = "pass" | "warn" | "fail";

const ICONS = { pass: "✓", warn: "▲", fail: "✗" };

function check(label: string, status: Status, message?: string): Status {
  const text = message ? `${label}: ${message}` : label;
  if (status === "pass") log.success(`${ICONS.pass} ${text}`);
  if (status === "warn") log.warn(`${ICONS.warn} ${text}`);
  if (status === "fail") log.error(`${ICONS.fail} ${text}`);
  return status;
}

function checkSkills(targetDir: string): Status {
  if (!pathExists(targetDir)) {
    return check("skills", "fail", `${TARGET_DIR}/${SKILLS_DIR} not found`);
  }

  const missing = EXPECTED_SKILLS.filter((s) => !pathExists(join(targetDir, s)));
  if (missing.length > 0) {
    return check("skills", "fail", `missing: ${missing.join(", ")}`);
  }

  const missingMd = EXPECTED_SKILLS.filter((s) => !pathExists(join(targetDir, s, "SKILL.md")));
  if (missingMd.length > 0) {
    return check("skills", "fail", `missing SKILL.md in: ${missingMd.join(", ")}`);
  }

  return check("skills", "pass", `${EXPECTED_SKILLS.length} skills ready`);
}

function checkCommands(targetDir: string): Status {
  if (!pathExists(targetDir)) {
    return check("commands", "warn", "not found");
  }

  const missing = EXPECTED_COMMANDS.filter((c) => !pathExists(join(targetDir, c)));
  if (missing.length > 0) {
    return check("commands", "warn", `missing: ${missing.join(", ")}`);
  }

  return check("commands", "pass", "all commands present");
}

function checkIntegrity(targetDir: string, sourceDir: string): Status {
  const modified = listFiles(targetDir).filter((f) => {
    const sourcePath = join(sourceDir, f);
    if (!pathExists(sourcePath)) return true;
    return hashFile(join(targetDir, f)) !== hashFile(sourcePath);
  });

  if (modified.length === 0) return check("integrity", "pass", "all files match original");
  if (modified.length <= 3) return check("integrity", "warn", `modified: ${modified.join(", ")}`);
  return check("integrity", "fail", `${modified.length} files modified`);
}

export default defineCommand({
  meta: { name: "doctor", description: "Check flower setup integrity" },
  run() {
    const targetSkillsDir = getTargetSkillsDir(process.cwd());
    const sourceSkillsDir = getSkillsSourceDir();
    const targetCommandsDir = getTargetCommandsDir(process.cwd());

    intro("🌸 flower doctor");

    if (!hasContent(sourceSkillsDir)) {
      log.error("Skills not found. CLI installation may be corrupted.");
      process.exit(1);
    }

    const results = [
      checkSkills(targetSkillsDir),
      checkCommands(targetCommandsDir),
      checkIntegrity(targetSkillsDir, sourceSkillsDir),
    ];

    if (results.includes("fail")) {
      outro("Run 'flower setup --force' to fix.");
      process.exit(1);
    }

    outro(results.includes("warn") ? "Setup has warnings." : "All checks passed.");
  },
});
