import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.110.0.1";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["workspace", "role", "communication", "records", "validation"],
    "AGENTS.md is missing workspace topics",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
