import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/discord/A-1.70.0.1.mjs";

const terms = "intents commands events permissions configuration validation";

test("accepts complete Discord guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-discord-"));
  await writeFile(join(root, "AGENTS.md"), terms);
  await expect(run({ root })).resolves.toEqual({
    ruleId: "A-1.70.0.1",
    status: "pass",
    message: "",
  });
});

test("reports missing Discord guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-discord-"));
  await writeFile(join(root, "AGENTS.md"), "intents commands");
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.70.0.1",
    status: "fail",
    message: expect.stringContaining("events"),
  });
});

test("reports a missing AGENTS document", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-discord-"));
  await expect(run({ root })).resolves.toEqual({
    ruleId: "A-1.70.0.1",
    status: "fail",
    message: "AGENTS.md is required.",
  });
});
