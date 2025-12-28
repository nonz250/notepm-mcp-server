/**
 * Tag domain handlers
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { parseInput, success } from "../shared/result.js";
import { TagClient } from "./client.js";
import {
  CreateTagInputSchema,
  DeleteTagInputSchema,
  ListTagsInputSchema,
} from "./schemas.js";
import type { TagToolName } from "./types.js";
import { TAG_TOOL_NAMES } from "./types.js";

/**
 * Check if the tool name is a tag tool
 */
export function isTagToolName(name: string): name is TagToolName {
  return Object.values(TAG_TOOL_NAMES).includes(name as TagToolName);
}

/**
 * Handle tag tool calls
 */
export async function handleTagToolCall(
  client: TagClient,
  name: TagToolName,
  args: unknown
): Promise<CallToolResult> {
  switch (name) {
    case TAG_TOOL_NAMES.LIST_TAGS: {
      const { note_code, page, per_page } = parseInput(ListTagsInputSchema, args);
      const result = await client.list({ note_code, page, per_page });

      if (result.tags.length === 0) {
        return success("Tags: 0 tags found");
      }

      const tagList = result.tags.map((t, i) => `${String(i + 1)}. ${t.name}`).join("\n");

      return success(
        `Tags: showing ${String(result.tags.length)} of ${String(result.meta.total)} tags\n\n${tagList}`
      );
    }

    case TAG_TOOL_NAMES.CREATE_TAG: {
      const { name } = parseInput(CreateTagInputSchema, args);
      const tag = await client.create({ name });
      return success(`Tag created: ${tag.name}`);
    }

    case TAG_TOOL_NAMES.DELETE_TAG: {
      const { name } = parseInput(DeleteTagInputSchema, args);
      await client.delete({ name });
      return success(`Tag deleted: ${name}`);
    }
  }
}
