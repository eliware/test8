import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findRepositoryFiles } from "../../../../src/checks/general/E-1/find-repository-files.mjs";

test("discovers repository files while excluding dependency and generated trees", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-repository-files-"));
  await mkdir(join(root, "node_modules"));
  await writeFile(join(root, "README.md"), "readme");
  await writeFile(join(root, "node_modules", "ignored.txt"), "ignored");
  await expect(findRepositoryFiles(root)).resolves.toEqual(["README.md"]);
});
