import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "E-1.1.0";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "README.md",
    [
      "purpose",
      "requirements",
      "setup",
      "configuration",
      "usage",
      "validation",
      "operations",
      "security",
      "support",
      "license",
    ],
    "README.md is missing required sections",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
