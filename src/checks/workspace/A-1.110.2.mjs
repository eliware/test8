import { readFile } from "node:fs/promises";
import { fail, pass } from "../check-result.mjs";
import { walkFiles } from "../general/walk-files.mjs";

export const ruleId = "A-1.110.2";

const recordFiles = new Set(["runbooks.json", "workflows.json"]);

function recordsFor(data, file) {
  const key = file.replace(/\.json$/, "");
  if (Array.isArray(data[key])) return data[key];
  if (Array.isArray(data.items)) return data.items;
  return null;
}

export async function run({ root }) {
  try {
    const files = (await walkFiles(root)).filter((file) =>
      recordFiles.has(file.slice(file.lastIndexOf("\\") + 1)),
    );
    const findings = [];
    for (const file of files) {
      const data = JSON.parse(await readFile(file, "utf8"));
      const records = recordsFor(data, file.slice(file.lastIndexOf("\\") + 1));
      if (!records) {
        findings.push(`${file}: runbook/workflow records must be an array.`);
        continue;
      }
      const ids = new Set();
      for (const [index, record] of records.entries()) {
        const label = `${file}[${index}]`;
        if (!record || typeof record.id !== "string" || !record.id.trim())
          findings.push(`${label}: id is required.`);
        else if (ids.has(record.id)) findings.push(`${label}: duplicate id ${record.id}.`);
        else ids.add(record.id);
        for (const field of ["purpose", "owner"])
          if (typeof record?.[field] !== "string" || !record[field].trim())
            findings.push(`${label}: ${field} is required.`);
        if (!Array.isArray(record?.boundaries?.owns) || !Array.isArray(record.boundaries.excludes))
          findings.push(`${label}: boundaries.owns and boundaries.excludes are required arrays.`);
        if (!Array.isArray(record?.steps) || record.steps.length === 0)
          findings.push(`${label}: steps must be a non-empty array.`);
      }
    }
    return findings.length === 0 ? pass(ruleId) : fail(ruleId, findings.join(" "));
  } catch (error) {
    return fail(ruleId, error.message);
  }
}
