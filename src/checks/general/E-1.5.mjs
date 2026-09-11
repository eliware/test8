import { readFile } from "node:fs/promises";
import { fail, pass } from "../check-result.mjs";
import { walkFiles } from "./walk-files.mjs";

export const ruleId = "E-1.5";

export async function run({ root }) {
  try {
    const files = await walkFiles(root);
    for (const file of files.filter(
      (path) => /\.(mjs|js|ts)$/.test(path) && !path.endsWith("E-1.5.mjs"),
    )) {
      if (/coverageIgnore|istanbul ignore/.test(await readFile(file, "utf8"))) {
        return fail(ruleId, "Source must not use coverage-ignore directives.");
      }
    }
    return pass(ruleId);
  } catch (error) {
    return fail(ruleId, error.message);
  }
}
