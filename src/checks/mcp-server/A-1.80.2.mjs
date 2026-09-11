import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.80.2";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "README.md",
    [
      "purpose",
      "requirements",
      "setup",
      "configuration",
      "tools",
      "resources",
      "prompts",
      "transport",
      "authentication",
      "schemas",
      "validation",
      "operations",
      "security",
      "support",
      "license",
    ],
    "MCP README.md is missing",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
