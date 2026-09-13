import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { parseDetailed, parseSummary, parseText } from "./coverage-parsers.mjs";

const candidates = [
  "coverage/coverage-final.json",
  "coverage/coverage-summary.json",
  "coverage/coverage.json",
  "coverage.json",
];

async function readJson(path, relativePath, startedAt) {
  const before = startedAt ? await stat(path) : null;
  const parsed = JSON.parse(await readFile(path, "utf8"));
  const after = startedAt ? await stat(path) : null;
  if (startedAt && (!after || after.mtimeMs <= startedAt || before?.mtimeMs !== after.mtimeMs)) {
    throw new Error(`Coverage report is stale or changed: ${relativePath}. Rerun the tests.`);
  }
  return relativePath.endsWith("coverage-final.json") || !parsed?.total
    ? parseDetailed(parsed)
    : parseSummary(parsed);
}

export async function readCoverageEvidence(root, testOutput = "", startedAt = 0) {
  let lastError;
  for (const relativePath of candidates) {
    try {
      const evidence = await readJson(join(root, relativePath), relativePath, startedAt);
      if (evidence) return { ...evidence, source: relativePath };
      lastError = new Error(`Coverage report is invalid: ${relativePath}. Rerun the tests.`);
    } catch (error) {
      if (error.code !== "ENOENT") lastError = error;
    }
  }
  const textEvidence = parseText(testOutput);
  if (textEvidence) return { ...textEvidence, source: "Jest text output" };
  throw lastError ?? new Error("Coverage evidence is missing. Rerun Jest with coverage enabled.");
}
