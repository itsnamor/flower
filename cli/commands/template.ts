import { defineCommand } from "citty";
import { join } from "node:path";

import { getTemplatesSourceDir } from "$utils/paths";
import { pathExists, isDirectory, listDirectories, listMarkdownFiles, readTextFile } from "$utils/fs";

const sourceDir = getTemplatesSourceDir();

type TemplateEntry = { phase: string; files: string[] };

function getTemplateEntries(): TemplateEntry[] {
  if (!pathExists(sourceDir)) return [];

  return listDirectories(sourceDir)
    .map((phase) => ({
      phase,
      files: listMarkdownFiles(join(sourceDir, phase)).map((f) => f.replace(/\.md$/, "")),
    }))
    .filter((e) => e.files.length > 0);
}

function renderTree(entries: TemplateEntry[]) {
  console.log(".");

  entries.forEach(({ phase, files }, phaseIndex) => {
    const isLastPhase = phaseIndex === entries.length - 1;
    console.log(`${isLastPhase ? "└── " : "├── "}${phase}`);

    files.forEach((name, fileIndex) => {
      const isLastFile = fileIndex === files.length - 1;
      const indent = isLastPhase ? "    " : "│   ";
      const branch = isLastFile ? "└── " : "├── ";
      console.log(`${indent}${branch}${name}`);
    });
  });
}

function listTemplates() {
  if (!pathExists(sourceDir)) {
    console.error("Templates not found.");
    process.exit(1);
  }

  renderTree(getTemplateEntries());
}

function resolveTemplateFile(phase: string, template?: string): string {
  const phaseDir = join(sourceDir, phase);

  if (!isDirectory(phaseDir)) {
    console.error(`Phase "${phase}" not found.`);
    process.exit(1);
  }

  if (template) return `${template}.md`;

  const files = listMarkdownFiles(phaseDir);
  if (files.length === 0) {
    console.error(`No templates found for phase "${phase}".`);
    process.exit(1);
  }
  if (files.length > 1) {
    console.error(`Multiple templates available. Use ${phase}/<template>.`);
    process.exit(1);
  }

  return files[0];
}

function showTemplate(rawPath: string) {
  const [phase, template] = rawPath.split("/");
  const fileName = resolveTemplateFile(phase, template);
  const filePath = join(sourceDir, phase, fileName);

  if (!pathExists(filePath)) {
    console.error(`Template "${fileName}" not found.`);
    process.exit(1);
  }

  process.stdout.write(readTextFile(filePath));
}

export default defineCommand({
  meta: { name: "template", description: "List and view spec templates" },
  subCommands: {
    list: defineCommand({
      meta: { name: "list", description: "List all available templates" },
      run: listTemplates,
    }),
    show: defineCommand({
      meta: { name: "show", description: "Display a template by path" },
      args: {
        path: {
          type: "positional",
          description: 'Template path (e.g., "plan", "propose/setup")',
          required: true,
        },
      },
      run({ args }) {
        showTemplate(args.path as string);
      },
    }),
  },
});
