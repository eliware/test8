import { runChild } from "./run-child.mjs";

export function buildLintArguments() {
  return ["--deny", "warnings", "."];
}

export function runLint(root) {
  return runChild("node", ["node_modules/oxlint/bin/oxlint", ...buildLintArguments()], {
    cwd: root,
  });
}
