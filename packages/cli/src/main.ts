#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function copyDirRecursive(src: string, dest: string): Promise<string[]> {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  const copied: string[] = [];

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copied.push(...(await copyDirRecursive(srcPath, destPath)));
    } else {
      await writeFile(destPath, await readFile(srcPath));
      copied.push(destPath);
    }
  }

  return copied;
}

const init = defineCommand({
  meta: {
    name: "init",
    description: "Initialize flower in your project",
  },
  run: async () => {
    const templatesDir = resolve(__dirname, "../templates");
    const destDir = resolve(process.cwd(), ".flower/templates");

    await mkdir(destDir, { recursive: true });

    const files = await readdir(templatesDir);
    for (const file of files) {
      const src = join(templatesDir, file);
      const dest = join(destDir, file);
      await writeFile(dest, await readFile(src));
    }

    console.log(`Copied ${files.length} templates to ${destDir}`);
    for (const file of files) {
      console.log(`  - ${file}`);
    }

    const crushConfigDir = resolve(homedir(), ".config/crush");

    const skillSrc = resolve(__dirname, "../skills/flower");
    const skillDest = resolve(crushConfigDir, "skills/flower");
    const skillExisted = await exists(skillDest);
    await copyDirRecursive(skillSrc, skillDest);
    if (skillExisted) {
      console.log("Updated existing skill: flower");
    } else {
      console.log("Installed skill: flower");
    }

    const cmdSrc = resolve(__dirname, "../commands/flower.md");
    const cmdDest = resolve(crushConfigDir, "commands/flower.md");
    const cmdExisted = await exists(cmdDest);
    await mkdir(resolve(crushConfigDir, "commands"), { recursive: true });
    await writeFile(cmdDest, await readFile(cmdSrc));
    if (cmdExisted) {
      console.log("Updated existing command: flower");
    } else {
      console.log("Installed command: flower");
    }

    console.log("Done!");
  },
});

const main = defineCommand({
  meta: {
    name: "flower",
    version: "0.1.2",
    description: "🌸 flower CLI",
  },
  subCommands: {
    init,
  },
});

runMain(main);
