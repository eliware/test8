import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.24.4";
export const parentRuleId = "E-1.24";

export async function run({ root }) {
  const workflows = await readdir(join(root, ".github", "workflows"), { withFileTypes: true });
  for (const entry of workflows.filter((item) => item.isFile() && /\.(?:ya?ml)$/i.test(item.name))) {
    const content = await readFile(join(root, ".github", "workflows", entry.name), "utf8");
    if (/\b(npm publish|docker push|ghcr\.io|kubectl apply|git push|git tag)\b/i.test(content)) {
      return fail(ruleId, `${entry.name} contains a publication, deployment, or synchronization command.`);
    }
  }
  return pass(ruleId);
}
