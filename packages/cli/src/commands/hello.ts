import { defineCommand } from "citty";
import { intro, outro, text, isCancel } from "@clack/prompts";
import { handleCancel } from "@/utils/prompts";

export default defineCommand({
  meta: {
    name: "hello",
    description: "Say hello to someone",
  },
  args: {
    name: {
      type: "positional",
      description: "Name to greet",
      required: false,
    },
    formal: {
      type: "boolean",
      description: "Use formal greeting",
      alias: "f",
    },
  },
  async run({ args }) {
    intro("hello");

    let name = args.name;
    if (!name) {
      const result = await text({
        message: "Who would you like to greet?",
        placeholder: "World",
      });
      if (handleCancel(result)) {
        return;
      }
      name = result || "World";
    }

    const greeting = args.formal ? "Good day" : "Hello";
    outro(`${greeting}, ${name}!`);
  },
});
