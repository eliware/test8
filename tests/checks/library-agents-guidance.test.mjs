import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/library/A-1.40.0.1.mjs";

const topics = "api exports declarations compatibility packaging consumer";

test("accepts AGENTS.md with all library topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-agents-"));
  await writeFile(join(root, "AGENTS.md"), topics);

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.40.0.1",
    status: "pass",
  });
});

test("reports missing library topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-agents-"));
  await writeFile(join(root, "AGENTS.md"), "api exports consumer");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.40.0.1",
    status: "fail",
    message: "AGENTS.md is missing library topics: declarations, compatibility, packaging.",
  });
});

test("rejects a missing AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-agents-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.40.0.1",
    status: "fail",
    message: "AGENTS.md is required before library requirements can be reviewed.",
  });
});
