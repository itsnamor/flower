#!/usr/bin/env node

import { defineCommand, runMain } from "citty";
import { intro, outro } from "@clack/prompts";

import pkg from "$/../package.json" with { type: "json" };
import commands from "$/commands";

const main = defineCommand({
  meta: {
    name: "flower",
    version: pkg.version,
    description: "🌸 scaffold structured development workflows in your project",
  },
  subCommands: commands,
  run: () => {
    intro("flower");
    outro("Use `flower --help` to see available commands");
  },
});

runMain(main);
