import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.80.0";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["mcp"],
    "AGENTS.md is missing MCP guidance",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
