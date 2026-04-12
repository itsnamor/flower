import { readFileSync } from "node:fs";
import { join } from "node:path";

type PackageJson = {
  name: string;
  version: string;
};

let cachedPkg: PackageJson | null = null;

export const getPackageInfo = (): PackageJson => {
  if (cachedPkg) return cachedPkg;

  const packagePath = join(import.meta.dirname, "../../../package.json");
  const content = readFileSync(packagePath, "utf-8");
  cachedPkg = JSON.parse(content) as PackageJson;
  return cachedPkg;
};
