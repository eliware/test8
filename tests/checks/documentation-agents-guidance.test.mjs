import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/documentation/A-1.100.0.1.mjs";

const terms = "documentation authority index link limits";

test("accepts complete documentation guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-documentation-"));
  await writeFile(join(root, "AGENTS.md"), terms);
  await expect(run({ root })).resolves.toEqual({
    ruleId: "A-1.100.0.1",
    status: "pass",
    message: "",
  });
});

test("reports missing documentation topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-documentation-"));
  await writeFile(join(root, "AGENTS.md"), "documentation authority");
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.100.0.1",
    status: "fail",
    message: expect.stringContaining("index"),
  });
});

test("reports a missing AGENTS document", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-documentation-"));
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.100.0.1",
    status: "fail",
    message: "AGENTS.md is required.",
  });
});
