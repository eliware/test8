import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/discord/A-1.70.0.mjs";

test("accepts Discord guidance in AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-discord-"));
  await writeFile(join(root, "AGENTS.md"), "Discord intents and permissions\n");
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.70.0", status: "pass", message: "" });
});

test("fails when Discord guidance is absent", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-discord-"));
  await writeFile(join(root, "AGENTS.md"), "General guidance\n");
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.70.0",
    status: "fail",
    message: expect.stringContaining("discord"),
  });
});

test("fails when AGENTS.md is absent", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-discord-"));
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "A-1.70.0", status: "fail" });
});
