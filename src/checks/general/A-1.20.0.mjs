import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.20.0";

export async function run({ root }) {
  try {
    const text = await readFile(join(root, "AGENTS.md"), "utf8");
    const required = [
      /Node(?:\.js)?\s+26/i,
      /runtime|command/i,
      /environment|\.env/i,
      /ESM|module system/i,
      /validation|test|lint/i,
    ];
    const missing = required.filter((pattern) => !pattern.test(text));
    return missing.length === 0
      ? pass(ruleId)
      : fail(
          ruleId,
          "AGENTS.md must document Node.js version, runtime, environment, modules, and validation.",
        );
  } catch {
    return fail(ruleId, "AGENTS.md is required for Node.js repository instructions.");
  }
}
