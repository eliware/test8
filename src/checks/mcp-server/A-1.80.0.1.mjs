import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.80.0.1";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["tools", "resources", "prompts", "transport", "authentication", "schemas", "protocol"],
    "AGENTS.md is missing MCP topics",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
