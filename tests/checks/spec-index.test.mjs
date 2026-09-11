import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/A-1.25.0.mjs";

async function fixture(index) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-specs-"));
  await mkdir(join(root, "specs"));
  await writeFile(join(root, "specs", "README.md"), index);
  await writeFile(join(root, "specs", "directives.json"), "{}");
  return root;
}

test("passes when every specification JSON is linked by specs/README.md", async () => {
  const root = await fixture("- [directives](directives.json)\n");
  expect(await run({ root })).toEqual({ ruleId: "A-1.25.0", status: "pass", message: "" });
});

test("fails when a specification JSON is not linked by specs/README.md", async () => {
  const root = await fixture("# Specifications\n");
  const result = await run({ root });
  expect(result.ruleId).toBe("A-1.25.0");
  expect(result.status).toBe("fail");
  expect(result.message).toMatch(/directives\.json/);
});
