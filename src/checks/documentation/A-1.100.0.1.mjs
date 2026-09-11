import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.100.0.1";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["documentation", "authority", "index", "link", "limits"],
    "AGENTS.md is missing documentation topics",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
