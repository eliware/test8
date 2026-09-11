import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/workspace/A-1.110.0.mjs";

test("requires workspace AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-workspace-"));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "AGENTS.md"), "# workspace\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
