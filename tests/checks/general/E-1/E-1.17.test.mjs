import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/general/E-1/E-1.17.mjs";

async function fixture(withTest = true) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mirror-"));
  await mkdir(join(root, "src", "nested"), { recursive: true });
  await mkdir(join(root, "tests", "nested"), { recursive: true });
  await writeFile(join(root, "src", "nested", "module.mjs"), "export {};");
  if (withTest) await writeFile(join(root, "tests", "nested", "module.test.mjs"), "test();");
  return root;
}

test("passes when every source module has a mirrored test", async () => {
  const root = await fixture();
  await expect(run({ root })).resolves.toEqual({ ruleId: "E-1.17", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});

test("reports missing mirrored tests", async () => {
  const root = await fixture(false);
  await expect(run({ root })).resolves.toEqual(
    expect.objectContaining({ status: "fail", message: expect.stringContaining("nested/module.mjs") }),
  );
  await rm(root, { recursive: true, force: true });
});
