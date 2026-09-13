import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/infrastructure/E-1.90/A-1.90.0.mjs";

test("requires infrastructure guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-infra-"));
  await writeFile(join(root, "AGENTS.md"), "infrastructure managed ownership validation secret");
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.90.0", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
