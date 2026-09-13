import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../src/checks/web/E-1.50/E-1.50.1.mjs";

test("requires a clean public asset root", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-web-"));
  await mkdir(join(root, "public"));
  expect((await run({ root, packageJson: {} })).status).toBe("pass");
  await mkdir(join(root, "public", "dist"));
  expect((await run({ root, packageJson: {} })).status).toBe("fail");
});
