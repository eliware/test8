import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.22.1";

const requiredPatterns = [
  /^node_modules\/?$/,
  /^\.git\/?$/,
  /^coverage\/?$/,
  /^(?:dist|build)\/?$/,
  /^(?:\.env|runtime-state|runtime_state)\/?$/,
];

export async function run({ root }) {
  try {
    const text = await readFile(join(root, ".gitignore"), "utf8");
    const lines = text.split(/\r?\n/).map((line) => line.replace(/^\s*\/?/, "").trim());
    const missing = requiredPatterns.filter((pattern) => !lines.some((line) => pattern.test(line)));
    return missing.length === 0
      ? pass(ruleId)
      : fail(
          ruleId,
          "`.gitignore` must exclude dependencies, VCS state, coverage, build output, runtime state, and secrets.",
        );
  } catch {
    return fail(ruleId, ".gitignore is required for repository hygiene enforcement.");
  }
}
