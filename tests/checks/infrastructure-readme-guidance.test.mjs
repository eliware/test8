import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/infrastructure/A-1.90.0.2.mjs";

test("accepts an infrastructure README with state-boundary terms", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-readme-"));
  await writeFile(
    join(root, "README.md"),
    "Desired state is operationally applied at runtime, with rollback procedures.\n",
  );

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.0.2",
    status: "pass",
  });
});

test("rejects an infrastructure README missing a required state boundary", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-readme-"));
  await writeFile(join(root, "README.md"), "Desired state is operational at runtime.\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.0.2",
    status: "fail",
  });
});

test("rejects a missing infrastructure README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-readme-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.0.2",
    status: "fail",
    message: "README.md is required.",
  });
});
