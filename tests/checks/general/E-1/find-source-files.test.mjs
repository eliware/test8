import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findSourceFiles } from "../../../../src/checks/general/E-1/find-source-files.mjs";

test("discovers source files while excluding generated and dependency trees", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-source-files-"));
  await mkdir(join(root, "node_modules"));
  await mkdir(join(root, "src"));
  await writeFile(join(root, "src", "value.mjs"), "export const value = 1;");
  await writeFile(join(root, "node_modules", "ignored.mjs"), "export const ignored = 1;");
  await expect(findSourceFiles(root)).resolves.toEqual([join(root, "src", "value.mjs")]);
});
