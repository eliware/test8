import { access } from "node:fs/promises";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.0";

export async function run({ root }) {
  try {
    await access(`${root}/AGENTS.md`);
    return pass(ruleId);
  } catch {
    return fail(ruleId, "AGENTS.md is required at the repository root.");
  }
}
