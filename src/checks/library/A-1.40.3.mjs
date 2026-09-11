import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.40.3";
const terms = [
  "purpose",
  "requirements",
  "setup",
  "configuration",
  "usage",
  "api",
  "validation",
  "packaging",
  "security",
  "support",
  "license",
  "examples",
];
export async function run({ root }) {
  try {
    const text = (await readFile(join(root, "README.md"), "utf8")).toLowerCase();
    const missing = terms.filter((term) => !text.includes(term));
    return missing.length
      ? fail(ruleId, `Library README.md is missing: ${missing.join(", ")}.`)
      : pass(ruleId);
  } catch {
    return fail(ruleId, "Library repositories require README.md.");
  }
}
