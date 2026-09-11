import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.25.0";

export async function run({ root }) {
  const specsRoot = join(root, "specs");
  let entries;
  let index;
  try {
    [entries, index] = await Promise.all([
      readdir(specsRoot, { withFileTypes: true }),
      readFile(join(specsRoot, "README.md"), "utf8"),
    ]);
  } catch {
    return fail(ruleId, "specs/README.md is required as the specification index.");
  }
  const missing = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .filter((name) => !index.includes(`(${name})`));
  if (missing.length > 0)
    return fail(ruleId, `Specification index does not link: ${missing.join(", ")}.`);
  return pass(ruleId);
}
