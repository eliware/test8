import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
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
  return async (name) => {
    const [command, script] = resolveNpmLauncher();
    const configDirectory = await mkdtemp(join(tmpdir(), "eliware-test-npm-"));
    const userConfig = join(configDirectory, "npmrc");
    await writeFile(userConfig, "", "utf8");
    const env = { ...process.env };
    delete env.npm_config_allow_scripts;
    env.npm_config_userconfig = userConfig;
    try {
      return await execute(command, [script, "run", name].filter(Boolean), { cwd: root, env });
    } finally {
      await rm(configDirectory, { recursive: true, force: true });
    }
  };
}

export function createDefaultStages(root, packageJson, { executePackage = runChild } = {}) {
  return {
    runConventions: (ignoredRuleIds = []) =>
      runConventionStage(() => runValidation(root, ignoredRuleIds)),
    runTests: (args) => runTestStage(root, args),
    runCoverage: (startedAt = 0) =>
      runCoverageStage(() =>
        readCoverageSummary({
          readFile: () => readFile(join(root, "coverage", "coverage-summary.json"), "utf8"),
          stat,
          reportPath: join(root, "coverage", "coverage-summary.json"),
          startedAt,
        }),
      ),
    runLint: () => runLintStage(root),
    runPackage: () => runPackageStage(packageJson, runPackageCommand(root, executePackage)),
  };
}
