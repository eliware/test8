import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.50.3";
const terms = [
  "purpose",
  "requirements",
  "setup",
  "configuration",
  "routes",
  "assets",
  "ports",
  "usage",
  "browser",
  "operations",
  "security",
  "support",
  "license",
];

export async function run({ root }) {
  try {
    const text = (await readFile(join(root, "README.md"), "utf8")).toLowerCase();
    const missing = terms.filter((term) => !text.includes(term));
    return missing.length === 0
      ? pass(ruleId)
      : fail(ruleId, `Web README.md is missing: ${missing.join(", ")}.`);
  } catch {
    return fail(ruleId, "Web repositories require README.md.");
  }
}
