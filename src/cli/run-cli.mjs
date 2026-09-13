import packageMetadata from "../../package.json" with { type: "json" };
import { writeStageDiagnostics } from "./write-stage-diagnostics.mjs";
import { readDiagnosticOptions } from "./read-diagnostic-options.mjs";
import { writeDebugTiming } from "./write-debug-timing.mjs";
import { runConventionStage } from "../orchestrators/run-convention-stage.mjs";
import { runValidation } from "../orchestrators/run-validation.mjs";

export async function runCli(
  args,
  write = console.log,
  root = process.cwd(),
  options = {},
) {
  if (args.includes("--version")) {
    write(packageMetadata.version);
    return 0;
  }
  if (args.includes("--help")) {
    write(
      "Usage: eliware-test [--help|--version|--debug-timing|--ignore-100x4|--ignore-monolith-limits|--no-runInBand]",
    );
    return 0;
  }
  try {
    const startedAt = Date.now();
    const diagnosticOptions = readDiagnosticOptions(args);
    const result = await runConventionStage(() =>
      runValidation(root, diagnosticOptions.ignoredRuleIds, {
        executeJest: options.executeJest !== false && diagnosticOptions.mode === null,
        executeLint: options.executeLint ?? options.executeJest ?? true,
        executeAudit: options.executeAudit ?? options.executeJest ?? true,
        executePack: options.executePack ?? options.executeJest ?? true,
        executePackageChecks: options.executePackageChecks ?? options.executeJest ?? true,
        executeFormat: options.executeFormat ?? options.executeJest ?? true,
        mode: diagnosticOptions.mode,
        jestArgs: diagnosticOptions.jestArgs,
      }),
    );
    writeStageDiagnostics(result, write);
    writeDebugTiming(write, startedAt, args.includes("--debug-timing"));
    return result.code;
  } catch (error) {
    write(error.message);
    return 18;
  }
}
