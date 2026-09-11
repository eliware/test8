import { selectPackageScripts } from "../process/select-package-scripts.mjs";

function outputOf(result) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n");
}

export async function runPackageStage(packageJson, execute) {
  try {
    const diagnostics = [];
    for (const [name, command] of selectPackageScripts(packageJson)) {
      const result = await execute(name, command);
      if (result.code !== 0) diagnostics.push(outputOf(result));
    }
    return { code: diagnostics.length > 0 ? 17 : 0, category: "package", diagnostics };
  } catch (error) {
    return { code: 17, category: "package", diagnostics: [error.message] };
  }
}
