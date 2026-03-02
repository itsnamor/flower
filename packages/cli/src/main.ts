#!/usr/bin/env bun
import * as p from "@clack/prompts";

const command = process.argv[2];

if (command === "init") {
  p.intro("🌸 flower");
  p.log.info("Hello, world!");
  p.outro("Done!");
} else {
  console.log("Usage: flower <command>");
  console.log("");
  console.log("Commands:");
  console.log("  init    Initialize flower in your project");
}
