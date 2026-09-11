import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/infrastructure/A-1.90.1.mjs";

const requiredTopics = [
  "purpose",
  "managed",
  "targets",
  "requirements",
  "setup",
  "configuration",
  "desired state",
  "validation",
  "change",
  "security",
  "support",
  "license",
];

test("accepts an infrastructure README covering all required topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-complete-"));
  await writeFile(join(root, "README.md"), requiredTopics.join("\n"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.1",
    status: "pass",
  });
});

test("rejects an infrastructure README missing a required topic", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-complete-"));
  await writeFile(join(root, "README.md"), requiredTopics.slice(0, -1).join("\n"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.1",
    status: "fail",
  });
});

test("rejects a missing infrastructure README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-complete-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.1",
    status: "fail",
    message: "README.md is required.",
  });
});
