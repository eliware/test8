import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.24";
export async function run({ root }) {
  try {
    await access(join(root, ".github", "workflows"));
    return pass(ruleId);
  } catch {
    return fail(ruleId, "A GitHub Actions workflow directory is required.");
  }
}
