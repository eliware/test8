import { readFile } from "node:fs/promises";
import { walkFiles } from "./walk-files.mjs";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.20.11.0";

export async function run({ root, packageJson }) {
  const required = ["typecheck", "build"].filter((name) => packageJson?.scripts?.[name]);
  if (required.length === 0) return pass(ruleId);
  const workflowFiles = (await walkFiles(root)).filter((file) =>
    /[\\/]\.github[\\/]workflows[\\/].+\.ya?ml$/.test(file),
  );
  const workflows = (await Promise.all(workflowFiles.map((file) => readFile(file, "utf8")))).join(
    "\n",
  );
  if (!workflows)
    return fail(ruleId, "CI validation workflow is required when build or typecheck is declared.");
  const missing = required.filter(
    (name) => !new RegExp(`npm\\s+run\\s+${name}\\b`).test(workflows),
  );
  return missing.length === 0
    ? pass(ruleId)
    : fail(ruleId, `CI must execute declared validation scripts: ${missing.join(", ")}.`);
}
