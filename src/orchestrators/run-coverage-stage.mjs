import { evaluateCoverage } from "../coverage/evaluate-coverage.mjs";

export async function runCoverageStage(readSummary) {
  try {
    const result = evaluateCoverage(await readSummary());
    return result.status === "pass"
      ? { code: 0, category: "coverage", gaps: [] }
      : { code: 10, category: "coverage", gaps: result.gaps };
  } catch (error) {
    return { code: 14, category: "internal", gaps: [], output: error.message };
  }
}
