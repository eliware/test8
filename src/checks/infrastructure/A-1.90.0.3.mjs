import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.90.0.3";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["target", "environment", "validator", "safety"],
    "AGENTS.md is missing infrastructure validation boundaries",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
