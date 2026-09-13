import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/discord/E-1.70/A-1.70.0.mjs";

test("requires Discord guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-discord-"));
  await writeFile(join(root, "AGENTS.md"), "discord configuration validation");
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.70.0", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
