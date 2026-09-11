import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.21";
export async function run({ root }) {
  try {
    const text = await readFile(join(root, ".gitignore"), "utf8");
    return ["node_modules", ".git", "coverage", "build", ".env"].every((term) =>
      text.includes(term),
    )
      ? pass(ruleId)
      : fail(
          ruleId,
          ".gitignore must exclude dependencies, VCS, coverage, build output, and secrets.",
        );
  } catch {
    return fail(ruleId, ".gitignore is required.");
  }
}
