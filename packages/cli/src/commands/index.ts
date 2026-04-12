import type { CommandDef } from "citty";

export default {
  version: () => import("./version").then((m) => m.default),
} satisfies Record<string, () => Promise<CommandDef>>;
