import { defineCommand } from "citty";
import { getPackageInfo } from "$/lib/package";

export default defineCommand({
  meta: {
    name: "version",
    description: "Display the current version",
  },
  run: () => {
    const pkg = getPackageInfo();
    console.log(`${pkg.name}@${pkg.version}`);
  },
});
