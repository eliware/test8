import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.26.0";
export async function run({ root, packageJson }) {
  try {
    const text = await readFile(join(root, "RELEASE_NOTES.md"), "utf8");
    return text.includes(packageJson?.version)
      ? pass(ruleId)
      : fail(ruleId, "RELEASE_NOTES.md must contain the current package version.");
  } catch {
    return fail(ruleId, "RELEASE_NOTES.md is required.");
  }
}
