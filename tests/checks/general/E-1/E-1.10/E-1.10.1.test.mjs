import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.10/E-1.10.1.mjs";

test("requires the exact Knit command sequence", async () => {
  await expect(run({ root: process.cwd() })).resolves.toEqual({ ruleId: "E-1.10.1", status: "pass", message: "" });
});

test("rejects commands that appear before the required prefix", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-knit-order-"));
  await mkdir(join(root, ".knit"));
  await writeFile(join(root, ".knit", "validate.mjs"), "console.log('before');\ngit pull --ff-only origin main\nnpm ci\nnpm test\n");
  await expect(run({ root })).resolves.toEqual(expect.objectContaining({ status: "fail" }));
  await rm(root, { recursive: true, force: true });
});
