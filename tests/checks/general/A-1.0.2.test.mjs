import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/A-1.0.2.mjs";

test("requires instruction-scope terms", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-agents-"));
  await writeFile(join(root, "AGENTS.md"), "subdirectory repository-wide\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "AGENTS.md"), "subdirectory\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
