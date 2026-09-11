import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { expect, test } from "@jest/globals";

async function files(root) {
  const result = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...(await files(path)));
    else if (entry.isFile() && path.endsWith(".mjs")) result.push(path);
  }
  return result;
}

test("every bundled check module has a mirrored Jest test file", async () => {
  const root = process.cwd();
  const sourceRoot = join(root, "src", "checks");
  const testRoot = join(root, "tests", "checks");
  const sourceFiles = await files(sourceRoot);
  const testFiles = new Set(await files(testRoot));
  const missing = sourceFiles
    .map((source) => join(testRoot, relative(sourceRoot, source).replace(/\.mjs$/, ".test.mjs")))
    .filter((expected) => !testFiles.has(expected));
  expect(missing).toEqual([]);
});
