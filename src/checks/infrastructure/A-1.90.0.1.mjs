import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.90.0.1";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "AGENTS.md",
    ["target", "ownership", "validation", "change control", "rollback", "secret"],
    "AGENTS.md is missing infrastructure topics",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
