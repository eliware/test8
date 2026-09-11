import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.2";

export async function run({ root }) {
  try {
    await access(join(root, "specs", "README.md"));
    return pass(ruleId);
  } catch {
    return fail(ruleId, "specs/README.md is required as the specification index.");
  }
}
