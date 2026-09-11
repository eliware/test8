import packageMetadata from "../../package.json" with { type: "json" };
import { runApplication } from "../orchestrators/run-application.mjs";
import { readPackageJson } from "./read-package-json.mjs";
import { writeStageDiagnostics } from "./write-stage-diagnostics.mjs";
import { runLintCommand } from "./run-lint-command.mjs";
import { runCoverageCommand } from "./run-coverage-command.mjs";
import { runFormatCommand } from "./run-format-command.mjs";
import { readDiagnosticOptions } from "./read-diagnostic-options.mjs";
import { writeDebugTiming } from "./write-debug-timing.mjs";

export async function runCli(
  args,
  write = console.log,
  root = process.cwd(),
  application = runApplication,
  runCoverage = runCoverageCommand,
) {
  if (args.includes("--version")) {
    write(packageMetadata.version);
    return 0;
  }
  if (args.includes("--help")) {
    write(
      "Usage: eliware-test [--help|--version|--lint|--format|--format-check|--debug-timing|--ignore-100x4|--ignore-monolith-limits|--no-runInBand]",
    );
    return 0;
  }
  try {
    if (args.includes("--lint")) return await runLintCommand(root, write);
    if (args.includes("--format")) return await runFormatCommand(root, false);
    if (args.includes("--format-check")) return await runFormatCommand(root, true);
    const startedAt = Date.now();
    const packageJson = await readPackageJson(root);
    const result = await application({
      root,
      args,
      packageJson,
      diagnosticOptions: readDiagnosticOptions(args),
      runCoverage: () => runCoverage(root, args.includes("--ignore-100x4")),
    });
    for (const stage of result.results) writeStageDiagnostics(stage, write);
    writeDebugTiming(write, startedAt, args.includes("--debug-timing"));
    return result.code;
  } catch (error) {
    write(error.message);
    return 18;
  }
}
