import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/general/E-1/E-1.24.mjs";

test("requires a workflow that handles push or pull request validation", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-ci-"));
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  await writeFile(join(root, ".github", "workflows", "validation.yml"), "on:\n  push:\n");
  await expect(run({ root })).resolves.toEqual({ ruleId: "E-1.24", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
