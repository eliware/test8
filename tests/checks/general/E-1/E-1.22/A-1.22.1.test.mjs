import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.22/A-1.22.1.mjs";

test("requires the deterministic repository ignore categories", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-gitignore-"));
  await writeFile(join(root, ".gitignore"), "node_modules\n.git\ncoverage\nbuild\nruntime-state\n.env\n.DS_Store\n");
  expect((await run({ root })).status).toBe("pass");
  await writeFile(join(root, ".gitignore"), "node_modules\n");
  expect((await run({ root })).status).toBe("fail");
});
