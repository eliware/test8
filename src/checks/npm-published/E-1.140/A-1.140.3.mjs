import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../check-result.mjs";

export const ruleId = "A-1.140.3";
export const parentRuleId = "E-1.140";

export async function run({ root }) {
  try {
    const files = (await readdir(join(root, ".github", "workflows"), { withFileTypes: true }))
      .filter((entry) => entry.isFile() && /\.(?:yml|yaml)$/i.test(entry.name));
    for (const file of files) {
      const content = await readFile(join(root, ".github", "workflows", file.name), "utf8");
      if (/npm\s+publish/i.test(content) && !/npm\s+test/i.test(content)) return fail(ruleId, `Publication workflow must inherit the validation gate: ${file.name}.`);
    }
  } catch {
    return pass(ruleId);
  }
  return pass(ruleId);
}
