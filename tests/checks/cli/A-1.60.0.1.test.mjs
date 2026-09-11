import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/cli/A-1.60.0.1.mjs";

test("requires CLI operational guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-cli-"));
  await writeFile(join(root, "AGENTS.md"), "entrypoint command validation platform\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "AGENTS.md"), "entrypoint\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
