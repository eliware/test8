import { readFile } from "node:fs/promises";
import { fail, pass } from "../check-result.mjs";
import { walkFiles } from "./walk-files.mjs";

export const ruleId = "E-1.20.16";

export async function run({ root }) {
  const allFiles = await walkFiles(root);
  const files = allFiles.filter((file) =>
    /[\\/]((src)|(tests))[\\].+\.(mjs|js|cjs|ts|tsx)$/.test(file),
  );
  const violations = [];
  for (const file of files) {
    const lines = (await readFile(file, "utf8")).split(/\r?\n/).filter(Boolean).length;
    const limit = /[\\/]tests[\\]/.test(file) ? 200 : 100;
    if (lines > limit) violations.push(`${file} (${lines} > ${limit})`);
  }
  return violations.length === 0
    ? pass(ruleId)
    : fail(ruleId, `Files exceed the v8 line limits: ${violations.join(", ")}`);
}
