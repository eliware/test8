import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/workspace/E-1.110/A-1.110.0/A-1.110.0.1.mjs";

test("requires workspace boundaries in AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-workspace-boundary-"));
  await writeFile(join(root, "AGENTS.md"), "workspace role boundary communication runbook validation");
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.110.0.1", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
