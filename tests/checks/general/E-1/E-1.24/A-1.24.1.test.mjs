import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../../src/checks/general/E-1/E-1.24/A-1.24.1.mjs";

test("rejects CodeScope in workflow files", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workflow-"));
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  await writeFile(join(root, ".github", "workflows", "ci.yml"), "run: codescope");
  expect((await run({ root })).status).toBe("fail");
  await writeFile(join(root, ".github", "workflows", "ci.yml"), "run: npm test");
  expect((await run({ root })).status).toBe("pass");
});
