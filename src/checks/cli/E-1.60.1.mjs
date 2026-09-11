import { fail, pass } from "../check-result.mjs";
import { requireDocumentTerms } from "../validate-documentation.mjs";
export const ruleId = "E-1.60.1";
export async function run({ root }) {
  const message = await requireDocumentTerms(
    root,
    "README.md",
    ["--help", "--version", "exit code", "redacted", "destructive"],
    "CLI README.md is missing",
  );
  return message ? fail(ruleId, message) : pass(ruleId);
}
