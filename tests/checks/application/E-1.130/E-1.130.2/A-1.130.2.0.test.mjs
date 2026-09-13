import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/application/E-1.130/E-1.130.2/A-1.130.2.0.mjs";

test("requires docs README to index end-user documents", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-app-docs-"));
  await mkdir(join(root, "docs"));
  await writeFile(join(root, "docs", "README.md"), "# Docs");
  await writeFile(join(root, "docs", "guide.md"), "# Guide");
  await expect(run({ root })).resolves.toEqual(expect.objectContaining({ status: "fail", message: expect.stringContaining("docs/guide.md") }));
  await rm(root, { recursive: true, force: true });
});
