import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.23";
export async function run({ root }) {
  try {
    const text = await readFile(join(root, "LICENSE"), "utf8");
    return /MIT/i.test(text) && /Copyright \(c\) 2026 Eliware/i.test(text)
      ? pass(ruleId)
      : fail(ruleId, "LICENSE must be the approved 2026 Eliware MIT license.");
  } catch {
    return fail(ruleId, "LICENSE is required.");
  }
}
