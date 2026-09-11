import { runLintStage } from "../orchestrators/run-lint-stage.mjs";

export async function runLintCommand(root, write, runStage = runLintStage) {
  const result = await runStage(root);
  if (result.output) write(result.output);
  return result.code;
}
