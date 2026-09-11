import { runLifecycle as defaultLifecycle } from "./run-lifecycle.mjs";
import { createDefaultStages } from "./create-default-stages.mjs";

export async function runApplication({
  root,
  args,
  packageJson,
  diagnosticOptions = { ignoredRuleIds: [] },
  runLifecycle = defaultLifecycle,
  runConventions,
  runTests,
  runCoverage,
  runLint,
  runPackage,
  createStages = createDefaultStages,
}) {
  const startedAt = Date.now();
  const defaults = createStages(root, packageJson);
  return runLifecycle({
    runConventions: () =>
      (runConventions ?? defaults.runConventions)(diagnosticOptions.ignoredRuleIds),
    runTests: () =>
      (runTests ?? ((currentRoot, currentArgs) => defaults.runTests(currentArgs)))(root, args),
    runCoverage: () => (runCoverage ?? defaults.runCoverage)(startedAt),
    runLint: () => (runLint ?? defaults.runLint)(),
    runPackage: () => (runPackage ?? defaults.runPackage)(packageJson, root),
  });
}
