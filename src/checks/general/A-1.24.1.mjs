import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.24.1";
export async function run({ root }) {
  try {
    for (const file of await readdir(join(root, ".github", "workflows"))) {
      if (
        /\.(yml|yaml)$/.test(file) &&
        /ubuntu/i.test(await readFile(join(root, ".github", "workflows", file), "utf8"))
      )
        return pass(ruleId);
    }
    return fail(ruleId, "CI workflows must run on Ubuntu.");
  } catch {
    return fail(ruleId, "A workflow is required.");
  }
}
