import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.22/A-1.22.0.mjs";

async function fixture(directives) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-directives-"));
  await mkdir(join(root, "specs"));
  await writeFile(join(root, "specs", "directives.json"), JSON.stringify({ directives }));
  return root;
}

test("accepts a valid E-rooted directive tree", async () => {
  const root = await fixture([{ id: "E-18", directives: [{ id: "A-18.1" }] }]);
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.22.0", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});

test("rejects invalid hierarchy and duplicate IDs", async () => {
  const root = await fixture([{ id: "A-18" }, { id: "E-18", directives: [{ id: "E-18.1" }, { id: "E-18.1" }] }]);
  await expect(run({ root })).resolves.toEqual(expect.objectContaining({ status: "fail", message: expect.stringContaining("must be an E-rule") }));
  await rm(root, { recursive: true, force: true });
});
