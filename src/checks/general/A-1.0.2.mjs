import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.0.2";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["subdirectory", "repository-wide"],
    "AGENTS.md is missing instruction scope",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
