#!/usr/bin/env bun
import { defineCommand, runMain } from "citty";

const init = defineCommand({
  meta: {
    name: "init",
    description: "Initialize flower in your project",
  },
  run: () => {
    console.log("Hello, world!");
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
