import { runChild } from "../process/run-child.mjs";
import { resolveNpmLauncher } from "../process/resolve-npm-launcher.mjs";

export async function runPackCommand(root, write, execute = runChild) {
  const [command, script] = resolveNpmLauncher();
  const result = await execute(command, [script, "pack", "--dry-run"], { cwd: root });
  const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
  if (output) write(output);
  return result.code;
}
