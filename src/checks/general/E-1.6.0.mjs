import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.6.0";
export async function run({ root }) {
  try {
    const text = await readFile(join(root, ".gitignore"), "utf8");
    return /backup|dump|restore|runtime state/i.test(text)
      ? pass(ruleId)
      : fail(ruleId, ".gitignore must exclude operational runtime and backup state.");
  } catch {
    return fail(ruleId, ".gitignore is required.");
  }
}
