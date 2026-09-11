import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.6";
export async function run({ root }) {
  try {
    const text = await readFile(join(root, ".gitignore"), "utf8");
    return /\.env/.test(text) && /node_modules/.test(text)
      ? pass(ruleId)
      : fail(ruleId, "Repository secrets and dependencies must be excluded from version control.");
  } catch {
    return fail(ruleId, ".gitignore is required for secret and dependency exclusion.");
  }
}
