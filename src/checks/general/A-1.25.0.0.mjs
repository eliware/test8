import { fail, pass } from "../check-result.mjs";
import { findStructuredReferenceGaps, jsonFilesUnder } from "./validate-structured-references.mjs";

export const ruleId = "A-1.25.0.0";

export async function run({ root }) {
  const findings = await findStructuredReferenceGaps(root, await jsonFilesUnder(root));
  return findings.length === 0
    ? pass(ruleId)
    : fail(ruleId, `Structured-document references failed: ${findings.join("; ")}.`);
}
