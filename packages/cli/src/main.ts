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
  args: {
    verbose: {
      type: "boolean",
      description: "Enable verbose output",
      alias: "v",
    },
  },
  subCommands: commands,
  setup: ({ args }) => {
    if (args.verbose) {
      Bun.env.VERBOSE = "true";
    }
  },
  run: () => {
    intro("flower");
    outro("Use `flower --help` to see available commands");
  },
});

runMain(main);
