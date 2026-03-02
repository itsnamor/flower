#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    console.log("Done!");
  },
});

const main = defineCommand({
  meta: {
    name: "flower",
    version: "0.1.0",
    description: "🌸 flower CLI",
  },
  subCommands: {
    init,
  },
});

runMain(main);
