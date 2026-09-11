import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/E-1.23.mjs";

const roots = [];

async function fixture(content) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-license-"));
  roots.push(root);
  if (content !== undefined) await writeFile(join(root, "LICENSE"), content);
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

test("passes for the approved Eliware MIT license", async () => {
  const root = await fixture("MIT License\nCopyright (c) 2026 Eliware\n");
  await expect(run({ root })).resolves.toEqual({ ruleId: "E-1.23", status: "pass", message: "" });
});

test("fails for a different license or attribution", async () => {
  const root = await fixture("Apache License\nCopyright (c) 2025 Someone Else\n");
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "E-1.23", status: "fail" });
});

test("fails when LICENSE is missing", async () => {
  const root = await fixture();
  await expect(run({ root })).resolves.toEqual({
    ruleId: "E-1.23",
    status: "fail",
    message: "LICENSE is required.",
  });
});
