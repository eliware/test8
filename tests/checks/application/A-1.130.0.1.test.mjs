import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/application/A-1.130.0.1.mjs";

test("requires application guidance in AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-app-"));
  await writeFile(join(root, "AGENTS.md"), "configuration connection shutdown workflow\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "AGENTS.md"), "configuration\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
