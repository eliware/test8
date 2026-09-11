import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.1";

export async function run({ root }) {
  try {
    await access(join(root, "README.md"));
    return pass(ruleId);
  } catch {
    return fail(ruleId, "README.md is required at the repository root.");
  }
}
