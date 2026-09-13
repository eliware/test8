import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.24.3";
export const parentRuleId = "E-1.24";

export async function run({ root }) {
  const workflows = await readdir(join(root, ".github", "workflows"), { withFileTypes: true });
  for (const entry of workflows.filter((item) => item.isFile() && /\.(?:ya?ml)$/i.test(item.name))) {
    const content = await readFile(join(root, ".github", "workflows", entry.name), "utf8");
    if (!/\nconcurrency:\s*\n/.test(`\n${content}`) || !content.includes("github.repository") || !content.includes("github.ref") || !/cancel-in-progress:\s*true/.test(content)) {
      return fail(ruleId, `${entry.name} must cancel obsolete runs for each repository and ref.`);
    }
  }
  return pass(ruleId);
}
