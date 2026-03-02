#!/usr/bin/env bun
import { defineCommand, runMain } from "citty";
import { mkdir, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const init = defineCommand({
  meta: {
    name: "init",
    description: "Initialize flower in your project",
  },
  run: async () => {
    const templatesDir = resolve(import.meta.dir, "../templates");
    const destDir = resolve(process.cwd(), ".flower/templates");

    await mkdir(destDir, { recursive: true });

    const files = await readdir(templatesDir);
    for (const file of files) {
      const src = join(templatesDir, file);
      const dest = join(destDir, file);
      await Bun.write(dest, Bun.file(src));
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
    version: "0.0.1",
    description: "🌸 flower CLI",
  },
  subCommands: {
    init,
  },
});

runMain(main);
