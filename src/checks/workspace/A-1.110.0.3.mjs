import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.110.0.3";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "README.md",
    ["status", "priorities", "decisions", "handoffs"],
    "Workspace README.md is missing recovery state",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
