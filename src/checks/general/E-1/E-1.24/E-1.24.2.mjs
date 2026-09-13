import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.24.2";
export const parentRuleId = "E-1.24";

export async function run({ root }) {
  const workflows = await readdir(join(root, ".github", "workflows"), { withFileTypes: true });
  for (const entry of workflows.filter((item) => item.isFile() && /\.(?:ya?ml)$/i.test(item.name))) {
    const content = await readFile(join(root, ".github", "workflows", entry.name), "utf8");
    const actions = [...content.matchAll(/uses:\s*actions\/(checkout|setup-node)@([^\s#]+)/g)];
    if (actions.some(([, , version]) => version !== "v6")) return fail(ruleId, `${entry.name} must use v6 for checkout and setup-node.`);
  }
  return pass(ruleId);
}
