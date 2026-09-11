import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.24.0";
export async function run({ root }) {
  try {
    const files = await readdir(join(root, ".github", "workflows"));
    for (const file of files) {
      if (/\.(yml|yaml)$/.test(file)) {
        const text = await readFile(join(root, ".github", "workflows", file), "utf8");
        if (/pull_request/.test(text) && /push/.test(text)) return pass(ruleId);
      }
    }
    return fail(ruleId, "A workflow must validate pull requests and pushes.");
  } catch {
    return fail(ruleId, "A GitHub Actions workflow is required.");
  }
}
