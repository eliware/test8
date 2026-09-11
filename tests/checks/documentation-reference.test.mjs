import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/documentation/A-1.100.3.mjs";

test("passes when documentation structured references resolve", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-docs-"));
  await mkdir(join(root, "docs"));
  await writeFile(join(root, "docs", "index.json"), JSON.stringify({ crosslinks: [] }));
  await expect(run({ root })).resolves.toEqual({
    ruleId: "A-1.100.3",
    status: "pass",
    message: "",
  });
});

test("reports documentation reference findings", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-docs-"));
  await mkdir(join(root, "docs"));
  await writeFile(
    join(root, "docs", "index.json"),
    JSON.stringify({ crosslinks: [{ path: "./missing.json", authoritativeFor: "missing" }] }),
  );
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.100.3",
    status: "fail",
    message: expect.stringContaining("Documentation references failed"),
  });
});

test("returns a deterministic failure when documentation discovery cannot read its root", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-docs-"));
  const file = join(root, "not-a-directory");
  await writeFile(file, "file");
  await expect(run({ root: file })).resolves.toMatchObject({ ruleId: "A-1.100.3", status: "fail" });
});
