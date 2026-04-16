import { defineCommand } from "citty";
import { join } from "node:path";
import { readdirSync, readFileSync } from "node:fs";

import { getTemplatesSourceDir } from "$lib/paths";
import { pathExists, isDirectory } from "$lib/fs";
import { getErrorMessage } from "$/utils/error";

const listTemplates = (sourceDir: string) => {
  if (!pathExists(sourceDir)) {
    console.error("Templates not found.");
    process.exit(1);
  }

  const phases = readdirSync(sourceDir).filter((f) =>
    isDirectory(join(sourceDir, f))
  );

  for (const phase of phases.sort()) {
    const files = readdirSync(join(sourceDir, phase)).filter((f) =>
      f.endsWith(".md")
    );

    if (files.length === 0) continue;

    if (files.length === 1) {
      console.log(`${phase}`);
    } else {
      for (const file of files.sort()) {
        const name = file.replace(/\.md$/, "");
        console.log(`${phase}/${name}`);
      }
    }
  }
};

const showTemplate = (sourceDir: string, rawPath: string) => {
  const [phase, template] = rawPath.split("/");

  const phaseDir = join(sourceDir, phase);
  if (!isDirectory(phaseDir)) {
    console.error(`Phase "${phase}" not found.`);
    process.exit(1);
  }

  let fileName: string;
  if (template) {
    fileName = `${template}.md`;
  } else {
    const files = readdirSync(phaseDir).filter((f) => f.endsWith(".md"));
    if (files.length === 0) {
      console.error(`No templates found for phase "${phase}".`);
      process.exit(1);
    }
    if (files.length > 1) {
      console.error(`Multiple templates available. Use ${phase}/<template>.`);
      process.exit(1);
    }
    fileName = files[0];
  }

  const filePath = join(phaseDir, fileName);
  if (!pathExists(filePath)) {
    console.error(`Template "${fileName}" not found.`);
    process.exit(1);
  }

  const content = readFileSync(filePath, "utf-8");
  process.stdout.write(content);
};

export default defineCommand({
  meta: { name: "template", description: "List and view spec templates" },
  args: {
    path: {
      type: "positional",
      description: 'Template path (e.g., "list", "plan", "propose/setup")',
      required: false,
    },
  },
  run: async ({ args }) => {
    const sourceDir = getTemplatesSourceDir();

    try {
      if (!args.path || args.path === "list") {
        listTemplates(sourceDir);
      } else {
        showTemplate(sourceDir, args.path);
      }
    } catch (e) {
      console.error(getErrorMessage(e));
      process.exit(1);
    }
  },
});
