#!/usr/bin/env node

import { defineCommand, runMain } from "citty";
import { intro, outro } from "@clack/prompts";

import pkg from "$/../package.json" with { type: "json" };
import commands from "$/commands";

const main = defineCommand({
  meta: {
    name: pkg.name,
    version: pkg.version,
    description: "flower - 🌸 Scaffold structured development workflows in your project",
  },
  subCommands: commands,
  run: () => {
    intro("flower");
    outro("Use `flower --help` to see available commands");
  },
});

runMain(main);
