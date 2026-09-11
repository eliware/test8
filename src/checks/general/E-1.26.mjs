import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.26";

export async function run({ root }) {
  try {
    await access(join(root, "RELEASE_NOTES.md"));
    return pass(ruleId);
  } catch {
    return fail(ruleId, "RELEASE_NOTES.md is required for a release-bearing repository.");
  }
}
