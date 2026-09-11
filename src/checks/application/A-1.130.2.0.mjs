import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.130.2.0";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "docs/README.md",
    ["setup", "configuration", "usage", "troubleshooting", "support"],
    "docs/README.md is missing",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
