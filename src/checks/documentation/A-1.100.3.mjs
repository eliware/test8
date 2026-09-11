import { fail, pass } from "../check-result.mjs";
import {
  findStructuredReferenceGaps,
  jsonFilesUnder,
} from "../general/validate-structured-references.mjs";

export const ruleId = "A-1.100.3";

export async function run({ root }) {
  try {
    const findings = await findStructuredReferenceGaps(root, await jsonFilesUnder(root));
    return findings.length === 0
      ? pass(ruleId)
      : fail(ruleId, `Documentation references failed: ${findings.join("; ")}.`);
  } catch (error) {
    return fail(ruleId, error.message);
  }
}
