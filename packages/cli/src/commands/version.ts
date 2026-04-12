import { defineCommand } from "citty";
import pkg from "@/../package.json" with { type: "json" };

export default defineCommand({
  meta: {
    name: "version",
    description: "Display the current version",
  },
  run() {
    console.log(`${pkg.name}@${pkg.version}`);
  },
});
