import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.90.2";

export async function run({ root, packageJson }) {
  const paths = packageJson?.eliware?.infrastructure?.requiredPaths;
  if (paths === undefined) return pass(ruleId);
  if (!Array.isArray(paths) || paths.some((path) => typeof path !== "string" || !path.trim()))
    return fail(ruleId, "eliware.infrastructure.requiredPaths must be a list of non-empty paths.");
  const missing = [];
  for (const path of paths) {
    try {
      await access(resolve(root, path));
    } catch {
      missing.push(path);
    }
  }
  return missing.length
    ? fail(ruleId, `Required infrastructure paths are missing: ${missing.join(", ")}.`)
    : pass(ruleId);
}
