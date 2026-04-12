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

const check = (name: string, status: Status, message: string): Status => {
  const logFn = { pass: log.success, warn: log.warn, fail: log.error };
  logFn[status](`${icons[status]} ${name}: ${message}`);
  return status;
};

const getIntegrityStatus = (modifiedCount: number): Status => {
  if (modifiedCount === 0) return "pass";
  if (modifiedCount <= 3) return "warn";
  return "fail";
};

const getIntegrityMessage = (modified: string[]): string => {
  if (modified.length === 0) return "all files match original";
  if (modified.length <= 3) return `modified: ${modified.join(", ")}`;
  return `${modified.length} files modified`;
};

const getOutroMessage = (hasWarnings: boolean): string => {
  if (hasWarnings) return "Run 'flower setup --force' to reset.";
  return "All checks passed.";
};

const getDirectoryMessage = (exists: boolean, dirPath: string): string => {
  if (exists) return `${dirPath} exists`;
  return `${dirPath} not found`;
};

const getSkillsMessage = (missing: string[]): string => {
  if (missing.length === 0) return "all skills present";
  return `missing: ${missing.join(", ")}`;
};

const getSkillMdMessage = (missingMd: string[]): string => {
  if (missingMd.length === 0) return "all SKILL.md present";
  return `missing in: ${missingMd.join(", ")}`;
};

const getCommandsMessage = (missing: string[]): string => {
  if (missing.length === 0) return "all commands present";
  return `missing: ${missing.join(", ")}`;
};

const checkSkillsDirectory = (targetDir: string): Status => {
  const exists = pathExists(targetDir);
  const status: Status = exists ? "pass" : "fail";
  return check("Skills Dir", status, getDirectoryMessage(exists, `${TARGET_DIR}/${SKILLS_DIR}`));
};

const checkCommandsDirectory = (targetDir: string): Status => {
  const exists = pathExists(targetDir);
  const status: Status = exists ? "pass" : "warn";
  return check(
    "Commands Dir",
    status,
    getDirectoryMessage(exists, `${TARGET_DIR}/${COMMANDS_TARGET_SUBDIR}`),
  );
};

const checkSkills = (targetDir: string): Status => {
  const missing = EXPECTED_SKILLS.filter((s) => !pathExists(join(targetDir, s)));
  const status: Status = missing.length === 0 ? "pass" : "fail";
  return check("Skills", status, getSkillsMessage(missing));
};

const checkSkillMd = (targetDir: string): Status => {
  const missingMd = EXPECTED_SKILLS.filter((s) => !pathExists(join(targetDir, s, "SKILL.md")));
  const status: Status = missingMd.length === 0 ? "pass" : "fail";
  return check("SKILL.md", status, getSkillMdMessage(missingMd));
};

const checkCommands = (targetDir: string): Status => {
  if (!pathExists(targetDir)) {
    return check("Commands", "warn", "commands directory not found");
  }
  const missing = EXPECTED_COMMANDS.filter((c) => !pathExists(join(targetDir, c)));
  const status: Status = missing.length === 0 ? "pass" : "warn";
  return check("Commands", status, getCommandsMessage(missing));
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

  const status = getIntegrityStatus(modified.length);
  return check("Integrity", status, getIntegrityMessage(modified));
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

    results.push(checkSkillsDirectory(targetSkillsDir));
    results.push(checkSkills(targetSkillsDir));
    results.push(checkSkillMd(targetSkillsDir));
    results.push(checkCommandsDirectory(targetCommandsDir));
    results.push(checkCommands(targetCommandsDir));
    results.push(await checkIntegrity(targetSkillsDir, sourceSkillsDir));

    if (results.includes("fail")) {
      outro("Run 'flower setup --force' to fix.");
      process.exit(1);
    }

    outro(getOutroMessage(results.includes("warn")));
  },
});
