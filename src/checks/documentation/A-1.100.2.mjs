import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.100.2";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "README.md",
    [
      "scope",
      "authority",
      "navigation",
      "contribution",
      "validation",
      "security",
      "support",
      "license",
    ],
    "Documentation README.md is missing",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
