import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.70.2";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "README.md",
    [
      "purpose",
      "requirements",
      "setup",
      "configuration",
      "commands",
      "events",
      "intents",
      "permissions",
      "validation",
      "operations",
      "security",
      "support",
      "license",
    ],
    "Discord README.md is missing",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
