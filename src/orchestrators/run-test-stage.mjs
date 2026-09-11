import { runJest } from "../process/run-jest.mjs";

function combineOutput(stdout, stderr) {
  return [stdout, stderr].filter(Boolean).join("\n");
}

export async function runTestStage(root, args, execute = runJest) {
  try {
    const result = await execute(root, args);
    return {
      code: result.code ?? 14,
      category: "tests",
      output: combineOutput(result.stdout, result.stderr),
    };
  } catch (error) {
    return { code: 14, category: "internal", output: error.message };
  }
}
