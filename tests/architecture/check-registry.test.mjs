import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { expect, test } from "@jest/globals";
import { discoverAllChecks } from "../../src/orchestrators/discover-checks.mjs";

async function files(root) {
  const result = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...(await files(path)));
    else if (entry.isFile()) result.push(path);
  }
  return result;
}

test("every bundled source module has a mirrored Jest test", async () => {
  const root = process.cwd();
  const sourceRoot = join(root, "src", "checks");
  const testRoot = join(root, "tests", "checks");
  const sourceFiles = (await files(sourceRoot)).filter((file) => file.endsWith(".mjs"));
  const testFiles = new Set((await files(testRoot)).filter((file) => file.endsWith(".test.mjs")));
  const missing = sourceFiles
    .map((source) => join(testRoot, relative(sourceRoot, source).replace(/\.mjs$/, ".test.mjs")))
    .filter((expected) => !testFiles.has(expected));
  expect(missing).toEqual([]);
});

test("all discovered checks have unique identities and executable entry points", async () => {
  const checks = await discoverAllChecks();
  const ids = checks.map(({ ruleId }) => ruleId);
  expect(checks.length).toBeGreaterThan(0);
  expect(new Set(ids).size).toBe(ids.length);
  expect(checks.every(({ ruleId }) => /^([EA])-\d+(?:\.\d+)*$/.test(ruleId))).toBe(true);
  expect(checks.every(({ run }) => typeof run === "function")).toBe(true);
});

test("bundled runtime source does not require the private conventions repository", async () => {
  const sourceFiles = (await files(join(process.cwd(), "src"))).filter((file) => file.endsWith(".mjs"));
  const references = [];
  for (const file of sourceFiles) {
    const content = await readFile(file, "utf8");
    if (/from\s+["'][^"']*eliware\/conventions|import\(\s*["'][^"']*eliware\/conventions/.test(content)) {
      references.push(relative(process.cwd(), file));
    }
  }
  expect(references).toEqual([]);
});
