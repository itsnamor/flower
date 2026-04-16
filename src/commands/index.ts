import type { Resolvable, SubCommandsDef } from "citty";

export default {
  setup: () => import("./setup").then((m) => m.default),
  doctor: () => import("./doctor").then((m) => m.default),
  template: () => import("./template").then((m) => m.default),
} satisfies Resolvable<SubCommandsDef>;
