#!/usr/bin/env node

import { defineCommand, runMain } from "citty";

import commands from "$/commands";
import { getPackageInfo } from "$/lib/package";

const pkg = getPackageInfo();

const main = defineCommand({
  meta: {
    name: "flower",
    version: pkg.version,
    description: "🌸 scaffold structured development workflows in your project",
  },
  subCommands: commands,
});

runMain(main);
