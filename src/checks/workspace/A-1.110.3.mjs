import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { fail, pass } from "../check-result.mjs";
import { walkFiles } from "../general/walk-files.mjs";

export const ruleId = "A-1.110.3";

export async function run({ root }) {
  try {
    const findings = [];
    for (const file of await walkFiles(root)) {
      if (!file.endsWith(".json") || /(?:package|package-lock)\.json$/.test(file)) continue;
      const data = JSON.parse(await readFile(file, "utf8"));
      const schema = data?.schema;
      if (!schema) continue;
      if (!Array.isArray(schema.requiredFields)) {
        findings.push(`${file}: schema.requiredFields must be an array.`);
        continue;
      }
      const records = Array.isArray(data.items)
        ? data.items
        : Object.values(data).find(Array.isArray);
      if (!records) continue;
      for (const [index, record] of records.entries())
        for (const field of schema.requiredFields)
          if (typeof field !== "string" || record?.[field] === undefined)
            findings.push(`${file}[${index}]: missing required field ${field}.`);
      const readme = join(file.slice(0, file.lastIndexOf("\\")), "README.md");
      try {
        const indexText = await readFile(readme, "utf8");
        if (!indexText.includes(basename(file)))
          findings.push(`${readme}: must index ${basename(file)}.`);
      } catch {
        findings.push(`${readme}: README.md is required for the record collection.`);
      }
    }
    return findings.length ? fail(ruleId, findings.join(" ")) : pass(ruleId);
  } catch (error) {
    return fail(ruleId, error.message);
  }
}
