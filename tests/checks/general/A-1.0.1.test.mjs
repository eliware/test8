import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/A-1.0.1.mjs";

test("requires scope and boundary terms", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-agents-"));
  await writeFile(join(root, "AGENTS.md"), "scope boundaries\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "AGENTS.md"), "scope\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
