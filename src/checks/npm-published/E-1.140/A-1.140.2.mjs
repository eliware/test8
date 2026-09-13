import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../check-result.mjs";

export const ruleId = "A-1.140.2";
export const parentRuleId = "E-1.140";

export async function run({ root }) {
  let workflows;
  try {
    workflows = (await readdir(join(root, ".github", "workflows"), { withFileTypes: true }))
      .filter((entry) => entry.isFile() && /\.(?:yml|yaml)$/i.test(entry.name));
  } catch {
    return pass(ruleId);
  }
  for (const workflow of workflows) {
    const content = await readFile(join(root, ".github", "workflows", workflow.name), "utf8");
    if (!/npm\s+publish/i.test(content)) continue;
    if (!/(?:tags|tag).{0,100}v\*\.\*\.\*/is.test(content) || !/npm\s+(?:pkg\s+get\s+version|version|view)/i.test(content) || !/ubuntu-latest/i.test(content)) {
      return fail(ruleId, `Publication workflow must use exact version tags, verify package version, and validate on Ubuntu: ${workflow.name}.`);
    }
  }
  return pass(ruleId);
}
