import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.130.1";
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
    "Application README.md is missing",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
