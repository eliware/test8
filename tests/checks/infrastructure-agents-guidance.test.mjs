import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/infrastructure/A-1.90.0.1.mjs";

const terms = "target ownership validation change control rollback secret";

test("accepts complete infrastructure guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infrastructure-"));
  await writeFile(join(root, "AGENTS.md"), terms);
  await expect(run({ root })).resolves.toEqual({
    ruleId: "A-1.90.0.1",
    status: "pass",
    message: "",
  });
});

test("reports missing infrastructure topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infrastructure-"));
  await writeFile(join(root, "AGENTS.md"), "target ownership");
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.0.1",
    status: "fail",
    message: expect.stringContaining("validation"),
  });
});

test("reports a missing infrastructure guidance file", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infrastructure-"));
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.90.0.1",
    status: "fail",
    message: "AGENTS.md is required.",
  });
});
