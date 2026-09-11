import { readFile } from "node:fs/promises";
import { fail, pass } from "../check-result.mjs";
import { walkFiles } from "../general/walk-files.mjs";

export const ruleId = "A-1.90.3";

export async function run({ root }) {
  try {
    const findings = [];
    for (const file of await walkFiles(root)) {
      if (!file.endsWith(".json")) continue;
      try {
        JSON.parse(await readFile(file, "utf8"));
      } catch (error) {
        findings.push(`${file}: ${error.message}`);
      }
    }
    return findings.length ? fail(ruleId, findings.join(" ")) : pass(ruleId);
  } catch (error) {
    return fail(ruleId, error.message);
  }
}
