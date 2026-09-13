import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.8.mjs";

async function fixture(example) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-env-"));
  await mkdir(join(root, "src"));
  await writeFile(join(root, "src", "module.mjs"), "export const value = process.env.EXAMPLE_VALUE;");
  if (example !== null) await writeFile(join(root, ".env.example"), example);
  return root;
}

test("passes when referenced variables are documented", async () => {
  const root = await fixture("EXAMPLE_VALUE=fixture\n");
  await expect(run({ root })).resolves.toEqual({ ruleId: "E-1.20.8", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});

test("reports missing environment documentation", async () => {
  const root = await fixture("OTHER=value\n");
  await expect(run({ root })).resolves.toEqual(expect.objectContaining({ status: "fail", message: expect.stringContaining("EXAMPLE_VALUE") }));
  await rm(root, { recursive: true, force: true });
});
