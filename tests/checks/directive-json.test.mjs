import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/E-1.22.mjs";

const roots = [];

async function fixture(content) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-directives-"));
  roots.push(root);
  await mkdir(join(root, "specs"), { recursive: true });
  if (content !== undefined) await writeFile(join(root, "specs", "record.json"), content);
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

test("passes when every specification JSON file is valid", async () => {
  const root = await fixture('{"version":"8.0"}');
  await expect(run({ root })).resolves.toEqual({ ruleId: "E-1.22", status: "pass", message: "" });
});

test("fails when a specification JSON file is malformed", async () => {
  const root = await fixture("not json");
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "E-1.22", status: "fail" });
});

test("passes when the specs directory is empty", async () => {
  const root = await fixture();
  await rm(join(root, "specs"), { recursive: true, force: true });
  await expect(run({ root })).resolves.toEqual({ ruleId: "E-1.22", status: "pass", message: "" });
});
