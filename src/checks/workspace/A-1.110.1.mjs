import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.110.1";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "README.md",
    [
      "purpose",
      "role",
      "authority",
      "records",
      "runbooks",
      "workflows",
      "communication",
      "validation",
      "security",
      "support",
      "recovery",
    ],
    "Workspace README.md is missing",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
