import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "A-1.24.0";
export const parentRuleId = "E-1.24";

export async function run({ root }) {
  const workflows = await readdir(join(root, ".github", "workflows"), { withFileTypes: true });
  for (const entry of workflows.filter((item) => item.isFile() && /\.(?:ya?ml)$/i.test(item.name))) {
    const content = await readFile(join(root, ".github", "workflows", entry.name), "utf8");
    const install = content.indexOf("npm ci");
    const test = content.indexOf("npm test");
    if (install < 0 || test < 0 || install > test) return fail(ruleId, `${entry.name} must run npm ci followed by npm test.`);
  }
  return pass(ruleId);
}
