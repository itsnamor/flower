import { cancel, isCancel } from "@clack/prompts";

export function handleCancel<T>(value: T | symbol): value is symbol {
  if (isCancel(value)) {
    cancel("Operation cancelled");
    process.exit(0);
  }
  return false;
}

export function verboseLog(message: string): void {
  if (Bun.env.VERBOSE === "true") {
    console.log(`[verbose] ${message}`);
  }
}
