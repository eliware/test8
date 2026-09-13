import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/discord/E-1.70/A-1.70.0/A-1.70.0.1.mjs";

test("requires Discord operational topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-discord-topics-"));
  await writeFile(join(root, "AGENTS.md"), "intents commands events permissions configuration validation");
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.70.0.1", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
