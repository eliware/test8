import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../src/checks/web/E-1.50/A-1.50.3.mjs";

test("requires web README topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-web-"));
  await writeFile(join(root, "README.md"), "purpose requirements setup configuration routes assets ports usage browser operations security support license");
  expect((await run({ root })).status).toBe("pass");
  await writeFile(join(root, "README.md"), "purpose");
  expect((await run({ root })).status).toBe("fail");
});
