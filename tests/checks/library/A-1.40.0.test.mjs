import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/library/A-1.40.0.mjs";

test("requires library AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-library-"));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "AGENTS.md"), "# library\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
