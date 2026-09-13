import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.16.mjs";

async function fixture(lines) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-monolith-"));
  await mkdir(join(root, "src"));
  await mkdir(join(root, "tests"));
  await writeFile(join(root, "src", "module.mjs"), `${"x\n".repeat(lines)}export {};`);
  await writeFile(join(root, "tests", "module.test.mjs"), "test();");
  return root;
}

test("passes when source and test files remain within their limits", async () => {
  const root = await fixture(10);
  await expect(run({ root })).resolves.toEqual({ ruleId: "E-1.20.16", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});

test("reports source files over the 100-line limit", async () => {
  const root = await fixture(101);
  await expect(run({ root })).resolves.toEqual(expect.objectContaining({ status: "fail", message: expect.stringContaining("src/module.mjs") }));
  await rm(root, { recursive: true, force: true });
});
