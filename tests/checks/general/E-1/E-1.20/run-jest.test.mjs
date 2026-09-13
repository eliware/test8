import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { buildJestArguments, runJest } from "../../../../../src/checks/general/E-1/E-1.20/run-jest.mjs";

test("builds the default in-band coverage command", () => {
  expect(buildJestArguments([])).toEqual(["--coverage", "--runInBand"]);
});

test("preserves focused paths and filters harness-only options", () => {
  expect(
    buildJestArguments(["tests/a.test.mjs", "--ignore-100x4", "--debug-timing", "--no-runInBand"]),
  ).toEqual(["--coverage", "--runTestsByPath", "tests/a.test.mjs", "--no-runInBand"]);
});

test("rejects a missing focused test before invoking Jest", async () => {
  let invoked = false;
  await expect(
    runJest("C:/fixture", ["tests/missing.test.mjs"], async () => {
      invoked = true;
      return { code: 0, stdout: "", stderr: "" };
    }),
  ).rejects.toThrow("Focused test path does not exist");
  expect(invoked).toBe(false);
});

test("maps a focused test to its mirrored source coverage", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-jest-"));
  await mkdir(join(root, "src"));
  await mkdir(join(root, "tests"));
  await writeFile(join(root, "src", "sample.mjs"), "export {};\n");
  await writeFile(join(root, "tests", "sample.test.mjs"), "test(\"sample\", () => {});\n");
  let received;
  await runJest(root, ["tests/sample.test.mjs"], async (...args) => {
    received = args;
    return { code: 0, stdout: "", stderr: "" };
  });
  expect(received[1]).toEqual([
    "node_modules/jest/bin/jest.js",
    "--coverage",
    "--coverageReporters=json",
    "--coverageReporters=json-summary",
    "--coverageReporters=text",
    "--collectCoverageFrom",
    "src/sample.mjs",
    "--runTestsByPath",
    "tests/sample.test.mjs",
    "--runInBand",
  ]);
  await rm(root, { recursive: true, force: true });
});
