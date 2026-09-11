import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.90.1";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "README.md",
    [
      "purpose",
      "managed",
      "targets",
      "requirements",
      "setup",
      "configuration",
      "desired state",
      "validation",
      "change",
      "security",
      "support",
      "license",
    ],
    "Infrastructure README.md is missing",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
