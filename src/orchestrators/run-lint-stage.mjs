import { runLint } from "../process/run-lint.mjs";

function outputOf(result) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n");
}

export async function runLintStage(root, execute = runLint) {
  try {
    const result = await execute(root);
    return {
      code: result.code === 0 ? 0 : 12,
      category: "lint",
      output: outputOf(result),
    };
  } catch (error) {
    return { code: 14, category: "internal", output: error.message };
  }
}
