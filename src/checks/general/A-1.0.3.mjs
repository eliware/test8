import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.0.3";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["read readme.md", "applicable", "documentation", "before changes"],
    "AGENTS.md is missing contributor reading guidance",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
