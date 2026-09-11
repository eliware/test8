import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { runCoverageStage } from "../orchestrators/run-coverage-stage.mjs";
import { readCoverageSummary } from "../coverage/read-summary.mjs";

export async function runCoverageCommand(root, ignoreCoverage, startedAt = 0) {
  const reportPaths = [
    join(root, "coverage", "coverage-summary.json"),
    join(root, "coverage", "coverage.json"),
    join(root, "coverage.json"),
  ];
  const result = await runCoverageStage(async () => {
    let lastError;
    for (const reportPath of reportPaths) {
      try {
        return await readCoverageSummary({
          readFile: () => readFile(reportPath, "utf8"),
          stat,
          reportPath,
          startedAt,
        });
      } catch (error) {
        if (error.code !== "ENOENT") lastError = error;
      }
    }
    throw lastError ?? new Error("Coverage summary is missing.");
  });
  return ignoreCoverage && result.category === "coverage" && result.code === 10
    ? { ...result, code: 0 }
    : result;
}
