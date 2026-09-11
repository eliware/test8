import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.60.2";
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
      "--help",
      "--version",
      "exit code",
      "validation",
      "operations",
      "security",
      "support",
      "license",
    ],
    "CLI README.md is missing",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
