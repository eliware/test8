import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { runCoverageStage } from "../orchestrators/run-coverage-stage.mjs";
import { readCoverageSummary } from "../coverage/read-summary.mjs";

export async function runCoverageCommand(root, ignoreCoverage) {
  const result = await runCoverageStage(() =>
    readCoverageSummary({
      readFile: () => readFile(join(root, "coverage", "coverage-summary.json"), "utf8"),
    }),
  );
  return ignoreCoverage && result.category === "coverage" && result.code === 10
    ? { ...result, code: 0 }
    : result;
}
