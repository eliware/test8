import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/documentation/A-1.100.2.mjs";

const terms = "scope authority navigation contribution validation security support license";

test("accepts complete documentation README guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-documentation-"));
  await writeFile(join(root, "README.md"), terms);
  await expect(run({ root })).resolves.toEqual({
    ruleId: "A-1.100.2",
    status: "pass",
    message: "",
  });
});

test("reports missing documentation README topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-documentation-"));
  await writeFile(join(root, "README.md"), "scope authority");
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.100.2",
    status: "fail",
    message: expect.stringContaining("navigation"),
  });
});

test("reports a missing documentation README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-documentation-"));
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.100.2",
    status: "fail",
    message: "README.md is required.",
  });
});
