import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/web/A-1.50.0.1.mjs";

const topics = "routes assets configuration browser deployment port";

test("accepts AGENTS.md with all web concerns", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-web-agents-"));
  await writeFile(join(root, "AGENTS.md"), topics);

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.50.0.1",
    status: "pass",
  });
});

test("reports missing web concerns", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-web-agents-"));
  await writeFile(join(root, "AGENTS.md"), "routes assets");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.50.0.1",
    status: "fail",
    message: "AGENTS.md must document web concerns: configuration, browser, deployment, port.",
  });
});

test("rejects a missing AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-web-agents-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.50.0.1",
    status: "fail",
    message: "AGENTS.md is required before web requirements can be reviewed.",
  });
});
