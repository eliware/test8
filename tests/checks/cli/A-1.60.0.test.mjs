import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/cli/A-1.60.0.mjs";

test("requires CLI guidance in AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-cli-"));
  await writeFile(join(root, "AGENTS.md"), "cli\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "AGENTS.md"), "repository\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
