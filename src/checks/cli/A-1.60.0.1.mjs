import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.60.0.1";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["entrypoint", "command", "validation", "platform"],
    "AGENTS.md is missing CLI topics",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
