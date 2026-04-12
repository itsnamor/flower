import { cancel, isCancel } from "@clack/prompts";

export function handleCancel<T>(value: T | symbol): value is symbol {
  if (isCancel(value)) {
    cancel("Operation cancelled");
    process.exit(0);
  }
  return false;
}
