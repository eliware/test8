import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveNpmLauncher } from "./resolve-npm-launcher.mjs";
import { runChild } from "./run-child.mjs";

export async function runAudit(root, execute = runChild) {
  const configDirectory = await mkdtemp(join(tmpdir(), "eliware-test-audit-"));
  const userConfig = join(configDirectory, "npmrc");
  await writeFile(userConfig, "", "utf8");
  try {
    const [command, script] = resolveNpmLauncher();
    return await execute(
      command,
      [
        script,
        "audit",
        "--audit-level=high",
        "--ignore-scripts",
        "--no-package-lock",
        `--userconfig=${userConfig}`,
      ].filter(Boolean),
      { cwd: root },
    );
  } finally {
    await rm(configDirectory, { recursive: true, force: true });
  }
}
