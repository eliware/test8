import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.0.0";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["repository", "purpose"],
    "AGENTS.md is missing identity",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
