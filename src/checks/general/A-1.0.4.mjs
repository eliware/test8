import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.0.4";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["validation commands"],
    "AGENTS.md is missing validation commands",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
