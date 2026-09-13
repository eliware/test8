import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "A-1.24.1";
export const parentRuleId = "E-1.24";

export async function run({ root }) {
  try {
    const files = (await readdir(join(root, ".github", "workflows"), { withFileTypes: true }))
      .filter((entry) => entry.isFile() && /\.(?:yml|yaml)$/i.test(entry.name));
    for (const file of files) {
      const content = await readFile(join(root, ".github", "workflows", file.name), "utf8");
      if (/codescope/i.test(content)) return fail(ruleId, `GitHub workflow must not invoke CodeScope: ${file.name}.`);
    }
  } catch {
    return fail(ruleId, "GitHub workflow files could not be inspected for CodeScope usage.");
  }
  return pass(ruleId);
}
