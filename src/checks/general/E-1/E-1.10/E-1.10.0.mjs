import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.10.0";
export const parentRuleId = "E-1.10";

export async function run({ root }) {
  try {
    const content = await readFile(join(root, ".knit", "validate.mjs"), "utf8");
    if (/\b(?:npm publish|docker push|kubectl apply|git tag|git push)\b/i.test(content)) {
      return fail(ruleId, ".knit/validate.mjs must not publish, deploy, release, or synchronize external state.");
    }
  } catch {
    return fail(ruleId, ".knit/validate.mjs is required for Knit validation.");
  }
  return pass(ruleId);
}
