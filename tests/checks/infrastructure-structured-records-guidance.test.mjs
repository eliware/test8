import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/infrastructure/A-1.90.0.4.mjs";

test("accepts an infrastructure README with structured-record guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-records-"));
  await writeFile(
    join(root, "README.md"),
    "Use JSON structured records as the authority for infrastructure state.\n",
  );

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.0.4",
    status: "pass",
  });
});

test("rejects an infrastructure README missing structured-record guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-records-"));
  await writeFile(join(root, "README.md"), "Use JSON records for infrastructure.\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.0.4",
    status: "fail",
  });
});

test("rejects a missing infrastructure README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-records-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.0.4",
    status: "fail",
    message: "README.md is required.",
  });
});
