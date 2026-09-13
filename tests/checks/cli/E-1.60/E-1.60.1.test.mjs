import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/cli/E-1.60/E-1.60.1.mjs";

test("requires an entrypoint and documented informational commands", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-cli-check-"));
  await mkdir(join(root, "bin"));
  await writeFile(join(root, "bin", "cli.mjs"), "console.log('--help', '--version');");
  await writeFile(join(root, "README.md"), "--help --version exit code");
  await expect(run({ root, packageJson: { bin: { cli: "bin/cli.mjs" } } })).resolves.toEqual({ ruleId: "E-1.60.1", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
