import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../check-result.mjs";
import { findRepositoryFiles } from "./find-repository-files.mjs";

export const ruleId = "E-1.7";
export const parentRuleId = "E-1";

const internalLabel = ["eliware", "internal"].join("-");
const internalSuffix = ["internal"].join(".");
const internalHost = ["internal", "eliware", "org"].join(".");
const internalPatterns = [
  new RegExp(`(?:^|[/.])${internalLabel}(?:[/.]|$)`, "i"),
  new RegExp(`\\b[a-z0-9-]+\\.${internalSuffix}\\b`, "i"),
  new RegExp(`(?:^|\\b)(?:internal|private)\\.(?:eliware|${internalHost})\\b`, "i"),
];
const inspectable = /\.(?:mjs|js|cjs|ts|tsx|json|ya?ml|env)$/i;

export async function run({ root, files: suppliedFiles }) {
  const findings = [];
  try {
    for (const file of suppliedFiles ?? await findRepositoryFiles(root)) {
      if (!inspectable.test(file)) continue;
      const content = await readFile(join(root, file), "utf8");
      if (internalPatterns.some((pattern) => pattern.test(content))) findings.push(file);
    }
  } catch (error) {
    return fail(ruleId, `Repository files could not be inspected: ${error.message}`);
  }
  if (findings.length > 0) {
    return fail(ruleId, `Infrastructure-internal identifiers found in public repository files: ${findings.join(", ")}.`);
  }
  return pass(ruleId);
}
