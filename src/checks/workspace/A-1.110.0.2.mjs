import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "A-1.110.0.2";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "README.md",
    ["json", "structured", "owner", "boundaries", "steps"],
    "Workspace README.md is missing structured workflow guidance",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
