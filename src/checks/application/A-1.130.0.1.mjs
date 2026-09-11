import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.130.0.1";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["configuration", "connection", "shutdown", "workflow"],
    "AGENTS.md is missing application topics",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
