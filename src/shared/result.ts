/**
 * Tool result helpers
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { InputError } from "./errors.js";

/**
 * Create a successful tool result
 */
export function success(text: string): CallToolResult {
  return { content: [{ type: "text", text }] };
}

/**
 * Create an error tool result
 */
export function error(text: string): CallToolResult {
  return { content: [{ type: "text", text }], isError: true };
}

/**
 * Parse and validate input, throw InputError on failure
 */
export function parseInput<T extends z.ZodType>(schema: T, args: unknown): z.infer<T> {
  const result = schema.safeParse(args);
  if (!result.success) {
    throw new InputError(result.error.message);
  }
  return result.data;
}
