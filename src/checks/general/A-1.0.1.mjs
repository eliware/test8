import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.0.1";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["scope", "boundaries"],
    "AGENTS.md is missing scope",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
