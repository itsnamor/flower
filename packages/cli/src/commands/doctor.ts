import { defineCommand } from "citty";
import { intro, outro, log } from "@clack/prompts";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  SKILLS_DIR,
  TARGET_DIR,
  EXPECTED_SKILLS,
  getSkillsSourceDir,
  getTargetSkillsDir,
  hasContent,
  listFiles,
  hashFile,
} from "$/utils/fs";

type Status = "pass" | "warn" | "fail";

const check = (name: string, status: Status, message: string): Status => {
  const icons = { pass: "✓", warn: "!", fail: "✗" };
  const logFn = { pass: log.success, warn: log.warn, fail: log.error };
  logFn[status](`${icons[status]} ${name}: ${message}`);
  return status;
};

export default defineCommand({
  meta: { name: "doctor", description: "Check Flower setup integrity" },
  run: () => {
    const targetDir = getTargetSkillsDir(process.cwd());
    const sourceDir = getSkillsSourceDir();

    intro("Flower Doctor");

    if (!hasContent(sourceDir)) {
      log.error("Skills not found. CLI installation may be corrupted.");
      process.exit(1);
    }

    const results: Status[] = [];

    // Directory check
    const dirExists = existsSync(targetDir);
    results.push(check("Directory", dirExists ? "pass" : "fail", `${TARGET_DIR}/${SKILLS_DIR} ${dirExists ? "exists" : "not found"}`));

    // Skills check
    const missing = EXPECTED_SKILLS.filter((s) => !existsSync(join(targetDir, s)));
    results.push(check("Skills", missing.length ? "fail" : "pass", missing.length ? `Missing: ${missing.join(", ")}` : "All skills present"));

    // SKILL.md check
    const missingMd = EXPECTED_SKILLS.filter((s) => !existsSync(join(targetDir, s, "SKILL.md")));
    results.push(check("SKILL.md", missingMd.length ? "fail" : "pass", missingMd.length ? `Missing in: ${missingMd.join(", ")}` : "All SKILL.md present"));

    // Integrity check
    const modified = listFiles(targetDir).filter((f) => {
      const targetPath = join(targetDir, f);
      const sourcePath = join(sourceDir, f);
      return !existsSync(sourcePath) || hashFile(targetPath) !== hashFile(sourcePath);
    });

    const status = modified.length === 0 ? "pass" : modified.length <= 3 ? "warn" : "fail";
    const msg = modified.length === 0
      ? "All files match original"
      : modified.length <= 3 ? `Modified: ${modified.join(", ")}` : `${modified.length} files modified`;
    results.push(check("Integrity", status, msg));

    if (results.includes("fail")) {
      outro("Errors found. Run 'flower setup --force' to fix.");
      process.exit(1);
    }
    outro(results.includes("warn") ? "Warnings found. Consider 'flower setup --force' to reset." : "All checks passed!");
  },
});
