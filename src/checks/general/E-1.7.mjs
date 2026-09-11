import { readFile } from "node:fs/promises";
import { walkFiles } from "./walk-files.mjs";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.7";
const internalPatterns = [/(?:^|[/.])eliware-internal(?:[/.]|$)/i, /\b[a-z0-9-]+\.internal\b/i];
const inspectable = /\.(?:mjs|js|cjs|ts|tsx|json|ya?ml|env)$/i;

export async function run({ root, files: suppliedFiles }) {
  const findings = [];
  for (const file of suppliedFiles ?? (await walkFiles(root))) {
    if (!inspectable.test(file) || /[\\/]node_modules[\\/]/.test(file)) continue;
    const content = await readFile(file, "utf8");
    if (internalPatterns.some((pattern) => pattern.test(content))) findings.push(file);
  }
  return findings.length === 0
    ? pass(ruleId)
    : fail(
        ruleId,
        `Infrastructure-internal identifiers found in public repository files: ${findings.join(", ")}.`,
      );
}
