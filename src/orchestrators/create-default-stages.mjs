import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { runConventionStage } from "./run-convention-stage.mjs";
import { runValidation } from "./run-validation.mjs";
import { runTestStage } from "./run-test-stage.mjs";
import { runCoverageStage } from "./run-coverage-stage.mjs";
import { readCoverageSummary } from "../coverage/read-summary.mjs";
import { runLintStage } from "./run-lint-stage.mjs";
import { runPackageStage } from "./run-package-stage.mjs";
import { runChild } from "../process/run-child.mjs";
import { resolveNpmLauncher } from "../process/resolve-npm-launcher.mjs";

function runPackageCommand(root, execute) {
  return (name) => {
    const [command, script] = resolveNpmLauncher();
    return execute(command, [script, "run", name].filter(Boolean), { cwd: root });
  };
}

export function createDefaultStages(root, packageJson, { executePackage = runChild } = {}) {
  return {
    runConventions: (ignoredRuleIds = []) =>
      runConventionStage(() => runValidation(root, ignoredRuleIds)),
    runTests: (args) => runTestStage(root, args),
    runCoverage: () =>
      runCoverageStage(() =>
        readCoverageSummary({
          readFile: () => readFile(join(root, "coverage", "coverage-summary.json"), "utf8"),
        }),
      ),
    runLint: () => runLintStage(root),
    runPackage: () => runPackageStage(packageJson, runPackageCommand(root, executePackage)),
  };
}
