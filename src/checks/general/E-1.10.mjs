import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.10";
export async function run({ root }) {
  try {
    await access(join(root, ".knit", "validate.mjs"));
    await access(join(root, ".knit", "deploy.yaml"));
    return pass(ruleId);
  } catch {
    return fail(ruleId, "Knit configuration and validation are required.");
  }
}
