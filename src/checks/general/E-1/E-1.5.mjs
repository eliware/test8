import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../check-result.mjs";
import { findPureBarrels, isPureBarrelSource } from "./E-1.20/find-pure-barrels.mjs";
import { findSourceFiles } from "./find-source-files.mjs";

export const ruleId = "E-1.5";
export const parentRuleId = "E-1";

export async function run({ root }) {
  try {
    const sourceRoot = join(root, "src");
    const files = await findSourceFiles(sourceRoot);
    const barrels = new Set(await findPureBarrels(root));
    for (const file of files) {
      const source = await readFile(file, "utf8");
      const relativePath = file.slice(root.length + 1).replaceAll("\\", "/");
      if (/\/\*[\s\S]*?istanbul\s+ignore|\/\/[^\r\n]*istanbul\s+ignore/i.test(source) && !barrels.has(relativePath)) {
        return fail(ruleId, `Coverage-ignore directives are not allowed: ${relativePath}.`);
      }
      if (barrels.has(relativePath) && !isPureBarrelSource(source)) {
        return fail(ruleId, `Pure-barrel classification changed while scanning: ${relativePath}.`);
      }
    }
    return pass(ruleId);
  } catch (error) {
    return fail(ruleId, error.message);
  }
}
