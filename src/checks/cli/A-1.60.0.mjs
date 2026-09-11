import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.60.0";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["cli"],
    "AGENTS.md is missing CLI guidance",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
