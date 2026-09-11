import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.22";
export async function run({ root }) {
  try {
    const files = await (await import("./walk-files.mjs")).walkFiles(join(root, "specs"));
    for (const file of files.filter((path) => path.endsWith(".json")))
      JSON.parse(await readFile(file, "utf8"));
    return pass(ruleId);
  } catch (error) {
    return fail(ruleId, error.message);
  }
}
