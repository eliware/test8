import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/infrastructure/A-1.90.0.mjs";

test("requires infrastructure AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-infra-"));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "AGENTS.md"), "# infrastructure\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
