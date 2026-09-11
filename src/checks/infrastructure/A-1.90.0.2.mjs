import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.90.0.2";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "README.md",
    ["desired state", "operational", "rollback", "runtime"],
    "Infrastructure README.md is missing state boundaries",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
