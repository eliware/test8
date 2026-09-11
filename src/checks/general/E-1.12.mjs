import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "E-1.12";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "README.md",
    ["deterministic", "repository"],
    "README.md must define deterministic repository scope",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
