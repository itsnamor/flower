import { defineCommand } from "citty";
import { intro, outro, log } from "@clack/prompts";
import { join } from "node:path";

import { SKILLS_DIR, TARGET_DIR, EXPECTED_SKILLS } from "$lib/constants";
import { getSkillsSourceDir, getTargetSkillsDir } from "$lib/paths";
import { hasContent, listFiles, hashFile, pathExists } from "$lib/fs";

type Status = "pass" | "warn" | "fail";

const check = (name: string, status: Status, message: string): Status => {
  const icons = { pass: "✓", warn: "!", fail: "✗" };
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
  if (modified.length === 0) return "All files match original";
  if (modified.length <= 3) return `Modified: ${modified.join(", ")}`;
  return `${modified.length} files modified`;
};

const getOutroMessage = (hasWarnings: boolean): string => {
  if (hasWarnings) return "Warnings found. Consider 'flower setup --force' to reset.";
  return "All checks passed!";
};

const getDirectoryMessage = (exists: boolean): string => {
  if (exists) return `${TARGET_DIR}/${SKILLS_DIR} exists`;
  return `${TARGET_DIR}/${SKILLS_DIR} not found`;
};

const getSkillsMessage = (missing: string[]): string => {
  if (missing.length === 0) return "All skills present";
  return `Missing: ${missing.join(", ")}`;
};

const getSkillMdMessage = (missingMd: string[]): string => {
  if (missingMd.length === 0) return "All SKILL.md present";
  return `Missing in: ${missingMd.join(", ")}`;
};

const checkDirectory = (targetDir: string): Status => {
  const exists = pathExists(targetDir);
  const status: Status = exists ? "pass" : "fail";
  return check("Directory", status, getDirectoryMessage(exists));
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
  meta: { name: "doctor", description: "Check Flower setup integrity" },
  run: async () => {
    const targetDir = getTargetSkillsDir(process.cwd());
    const sourceDir = getSkillsSourceDir();

    intro("flower doctor");

    if (!hasContent(sourceDir)) {
      log.error("Skills not found. CLI installation may be corrupted.");
      process.exit(1);
    }

    const results: Status[] = [];

    results.push(checkDirectory(targetDir));
    results.push(checkSkills(targetDir));
    results.push(checkSkillMd(targetDir));
    results.push(await checkIntegrity(targetDir, sourceDir));

    if (results.includes("fail")) {
      outro("Errors found. Run 'flower setup --force' to fix.");
      process.exit(1);
    }

    outro(getOutroMessage(results.includes("warn")));
  },
});
