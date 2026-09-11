import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.130.2";
export async function run({ root }) {
  try {
    await access(join(root, "docs", "README.md"));
    return pass(ruleId);
  } catch {
    return fail(ruleId, "Application repositories require docs/README.md.");
  }
}
