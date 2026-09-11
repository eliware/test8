import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/E-1.20.16.mjs";

test("passes files within source and test limits", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test-"));
  await mkdir(join(root, "src"));
  await mkdir(join(root, "tests"));
  await writeFile(join(root, "src", "small.mjs"), "export const value = 1;\n");
  await writeFile(join(root, "tests", "small.test.mjs"), 'test("ok", () => {});\n');
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});

test("fails oversized source files", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test-"));
  await mkdir(join(root, "src"));
  await writeFile(join(root, "src", "large.mjs"), `${"export const value = 1;\n".repeat(101)}`);
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
