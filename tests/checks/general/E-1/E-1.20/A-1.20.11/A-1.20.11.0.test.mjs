import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../../../src/checks/general/E-1/E-1.20/A-1.20.11/A-1.20.11.0.mjs";

test("requires declared stages in CI", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-ci-stage-"));
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  await writeFile(join(root, ".github", "workflows", "ci.yml"), "run: npm run typecheck\n");
  expect((await run({ root, packageJson: { scripts: { typecheck: "tsc", build: "build" } } })).status).toBe("fail");
  await writeFile(join(root, ".github", "workflows", "ci.yml"), "run: npm run typecheck\nrun: npm run build\n");
  expect((await run({ root, packageJson: { scripts: { typecheck: "tsc", build: "build" } } })).status).toBe("pass");
});
