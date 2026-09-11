import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/infrastructure/A-1.90.0.3.mjs";

test("accepts AGENTS.md with infrastructure validation boundaries", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-validation-"));
  await writeFile(
    join(root, "AGENTS.md"),
    "The target environment uses a validator with explicit safety rules.\n",
  );

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.0.3",
    status: "pass",
  });
});

test("rejects AGENTS.md missing an infrastructure validation boundary", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-validation-"));
  await writeFile(join(root, "AGENTS.md"), "The target environment has safety rules.\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.0.3",
    status: "fail",
  });
});

test("rejects missing AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-validation-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.0.3",
    status: "fail",
    message: "AGENTS.md is required.",
  });
});
