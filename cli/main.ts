#!/usr/bin/env node

import { defineCommand, runMain } from "citty";
import pkg from "../package.json";

import commands from "$/commands";

const main = defineCommand({
  meta: {
    name: "flower",
    version: pkg.version,
    description: pkg.description,
  },
  subCommands: commands,
});

runMain(main);
