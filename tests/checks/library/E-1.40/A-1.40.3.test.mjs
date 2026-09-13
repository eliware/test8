import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../src/checks/library/E-1.40/A-1.40.3.mjs";

test("requires library README topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-"));
  await writeFile(join(root, "README.md"), "purpose requirements setup configuration usage api validation packaging security support license docs/ examples/");
  expect((await run({ root })).status).toBe("pass");
  await writeFile(join(root, "README.md"), "purpose");
  expect((await run({ root })).status).toBe("fail");
});
