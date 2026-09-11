import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/discord/A-1.70.2.mjs";

const terms =
  "purpose requirements setup configuration commands events intents permissions validation operations security support license";

test("accepts a complete Discord README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-discord-"));
  await writeFile(join(root, "README.md"), terms);
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.70.2", status: "pass", message: "" });
});

test("reports missing Discord README topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-discord-"));
  await writeFile(join(root, "README.md"), "purpose setup");
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.70.2",
    status: "fail",
    message: expect.stringContaining("requirements"),
  });
});

test("reports a missing README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-discord-"));
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.70.2",
    status: "fail",
    message: "README.md is required.",
  });
});
