import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../check-result.mjs";

export const ruleId = "E-1.24";
export const parentRuleId = "E-1";

export async function run({ root }) {
  let workflows;
  try {
    workflows = (await readdir(join(root, ".github", "workflows"), { withFileTypes: true }))
      .filter((entry) => entry.isFile() && /\.(?:ya?ml)$/i.test(entry.name));
  } catch {
    return fail(ruleId, ".github/workflows must contain a GitHub Actions validation workflow.");
  }
  if (workflows.length === 0) return fail(ruleId, ".github/workflows must contain a GitHub Actions validation workflow.");
  const contents = await Promise.all(workflows.map((entry) => readFile(join(root, ".github", "workflows", entry.name), "utf8")));
  if (!contents.some((content) => /(^|\n)\s*(push|pull_request):/m.test(content))) {
    return fail(ruleId, "A GitHub Actions workflow must validate push and pull_request events.");
  }
  return pass(ruleId);
}
