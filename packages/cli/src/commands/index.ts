import type { CommandDef } from "citty";

export default {
  version: () => import("./version").then((m) => m.default),
  setup: () => import("./setup").then((m) => m.default),
  doctor: () => import("./doctor").then((m) => m.default),
} as Record<string, () => Promise<CommandDef>>;
