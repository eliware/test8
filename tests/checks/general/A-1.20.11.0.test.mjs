import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/A-1.20.11.0.mjs";

async function fixture(workflow) {
  const root = await mkdtemp(join(tmpdir(), "eliware-ci-"));
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  await writeFile(join(root, ".github", "workflows", "ci.yml"), workflow);
  return root;
}

test("requires CI execution for declared optional scripts", async () => {
  const root = await fixture("steps:\n  - run: npm run build\n");
  await expect(
    run({ root, packageJson: { scripts: { build: "vite build" } } }),
  ).resolves.toMatchObject({ status: "pass" });
  const missing = await fixture("steps:\n  - run: npm test\n");
  await expect(
    run({ root: missing, packageJson: { scripts: { build: "vite build" } } }),
  ).resolves.toMatchObject({ status: "fail" });
});

test("does not require a workflow when no optional scripts are declared", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-ci-"));
  await expect(run({ root, packageJson: { scripts: {} } })).resolves.toMatchObject({
    status: "pass",
  });
});
