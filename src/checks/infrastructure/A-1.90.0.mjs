import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.90.0";
export async function run({ root }) {
  try {
    await access(join(root, "AGENTS.md"));
    return pass(ruleId);
  } catch {
    return fail(ruleId, "Infrastructure repositories require AGENTS.md.");
  }
}
