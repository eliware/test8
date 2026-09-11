import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.24.4";
export async function run({ root }) {
  try {
    for (const file of await readdir(join(root, ".github", "workflows"))) {
      if (
        /\.(yml|yaml)$/.test(file) &&
        !/publish|deploy/i.test(await readFile(join(root, ".github", "workflows", file), "utf8"))
      )
        return pass(ruleId);
    }
    return fail(
      ruleId,
      "Validation workflows must not include unauthorized release or deployment jobs.",
    );
  } catch {
    return fail(ruleId, "A workflow is required.");
  }
}
