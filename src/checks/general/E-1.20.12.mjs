import { fail, pass } from "../check-result.mjs";
import { resolveNpmLauncher } from "../../process/resolve-npm-launcher.mjs";
import { runChild } from "../../process/run-child.mjs";

export const ruleId = "E-1.20.12";

export async function run({ root, packageJson, execute = runChild }) {
  const direct = Object.keys({
    ...packageJson?.dependencies,
    ...packageJson?.optionalDependencies,
  });
  if (direct.length === 0) return pass(ruleId);
  const [command, npmScript] = resolveNpmLauncher();
  const result = await execute(
    command,
    [npmScript, "outdated", "--json", "--silent"].filter(Boolean),
    { cwd: root },
  );
  if (result.code !== 0 && !result.stdout?.trim())
    return fail(ruleId, "npm outdated could not complete.");
  let outdated;
  try {
    outdated = result.stdout?.trim() ? JSON.parse(result.stdout) : {};
  } catch {
    return fail(ruleId, "npm outdated returned invalid JSON.");
  }
  const names = Object.keys(outdated).filter((name) => direct.includes(name));
  return names.length === 0
    ? pass(ruleId)
    : fail(ruleId, `Outdated direct dependencies: ${names.join(", ")}.`);
}
