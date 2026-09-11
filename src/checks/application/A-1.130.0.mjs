import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.130.0";
export async function run({ root }) {
  try {
    await access(join(root, "AGENTS.md"));
    return pass(ruleId);
  } catch {
    return fail(ruleId, "Application repositories require AGENTS.md.");
  }
}
