import type { CommandDef } from "citty";

export default {
  hello: () => import("./hello").then((m) => m.default),
  version: () => import("./version").then((m) => m.default),
} as Record<string, () => Promise<CommandDef>>;
