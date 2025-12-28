/**
 * Schema utility functions
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

/**
 * Convert Zod schema to MCP-compatible JSON Schema
 */
export function toInputSchema(schema: z.ZodType): Tool["inputSchema"] {
  return z.toJSONSchema(schema, { target: "draft-07" }) as Tool["inputSchema"];
}
