import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.70.0.1";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["intents", "commands", "events", "permissions", "configuration", "validation"],
    "AGENTS.md is missing Discord topics",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
