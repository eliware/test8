import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.17";
export async function run({ root }) {
  try {
    await access(join(root, "src"));
    await access(join(root, "tests"));
    return pass(ruleId);
  } catch {
    return fail(
      ruleId,
      "Repositories with production source require mirrored src and tests surfaces.",
    );
  }
}
