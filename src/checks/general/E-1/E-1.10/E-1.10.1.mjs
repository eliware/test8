import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.10.1";
export const parentRuleId = "E-1.10";

export async function run({ root }) {
  try {
    const content = await readFile(join(root, ".knit", "validate.mjs"), "utf8");
    const commands = [
      /git pull --ff-only origin main|\["git",\s*\["pull",\s*"--ff-only",\s*"origin",\s*"main"\]\]/,
      /npm ci|\["npm",\s*\["ci"\]\]/,
      /npm test|\["npm",\s*\["test"\]\]/,
    ];
    const firstPull = commands[0].exec(content)?.index ?? -1;
    const prefix = firstPull >= 0 ? content.slice(0, firstPull) : content;
    if (/console\.log\s*\(|\bnpm\s+(?:ci|test)\b|\["npm",\s*\[(?:"ci"|"test")\]/.test(prefix)) {
      return fail(ruleId, ".knit/validate.mjs must begin with the required synchronization and validation command sequence.");
    }
    let cursor = 0;
    for (const command of commands) {
      const match = command.exec(content.slice(cursor));
      if (!match) {
        return fail(ruleId, ".knit/validate.mjs must begin with git pull --ff-only origin main, npm ci, and npm test.");
      }
      cursor += match.index + match[0].length;
    }
  } catch {
    return fail(ruleId, ".knit/validate.mjs is required for Knit validation.");
  }
  return pass(ruleId);
}
