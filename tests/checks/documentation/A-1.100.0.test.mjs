import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/documentation/A-1.100.0.mjs";

test("requires documentation AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-docs-"));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "AGENTS.md"), "# instructions\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
