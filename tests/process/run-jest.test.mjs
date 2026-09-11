import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { buildJestArguments, runJest } from "../../src/process/run-jest.mjs";

test("builds the default in-band coverage command", () => {
  expect(buildJestArguments([])).toEqual(["--coverage", "--runInBand"]);
});

test("preserves focused paths and supports the diagnostic concurrency opt-out", () => {
  expect(buildJestArguments(["tests/a.test.mjs", "--no-runInBand"])).toEqual([
    "--coverage",
    "--runTestsByPath",
    "tests/a.test.mjs",
    "--no-runInBand",
  ]);
});

test("does not forward wrapper-only diagnostic flags to Jest", () => {
  expect(
    buildJestArguments(["--ignore-100x4", "--ignore-monolith-limits", "--debug-timing"]),
  ).toEqual(["--coverage", "--runInBand"]);
});

test("launches the native Jest executable with the repository root", async () => {
  const result = await runJest(process.cwd(), ["--help"]);
  expect(result.code).toBe(0);
  expect(result.stdout).toContain("Usage: jest");
});

test("adds the VM-modules option when the environment does not provide it", async () => {
  const previous = process.env.NODE_OPTIONS;
  delete process.env.NODE_OPTIONS;
  try {
    const result = await runJest(process.cwd(), ["--help"]);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain("Usage: jest");
  } finally {
    if (previous === undefined) delete process.env.NODE_OPTIONS;
    else process.env.NODE_OPTIONS = previous;
  }
});

test("uses default arguments through the execution seam", async () => {
  let received;
  await expect(
    runJest("C:/fixture", undefined, async (...args) => {
      received = args;
      return { code: 0, stdout: "", stderr: "" };
    }),
  ).resolves.toEqual({ code: 0, stdout: "", stderr: "" });
  expect(received[0]).toBe("node");
  expect(received[1]).toEqual(["node_modules/jest/bin/jest.js", "--coverage", "--runInBand"]);
  expect(received[2].cwd).toBe("C:/fixture");
});

test("collects only the mirrored source for an unambiguous focused test", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-focused-"));
  await mkdir(join(root, "src"));
  await writeFile(join(root, "src", "sample.mjs"), "export {};\n");
  let received;

  await runJest(root, ["tests/sample.test.mjs"], async (...args) => {
    received = args;
    return { code: 0, stdout: "", stderr: "" };
  });

  expect(received[1]).toEqual([
    "node_modules/jest/bin/jest.js",
    "--coverage",
    "--collectCoverageFrom",
    "src/sample.mjs",
    "--runTestsByPath",
    "tests/sample.test.mjs",
    "--runInBand",
  ]);
});

test("keeps broad coverage when a focused test has no mirrored source", async () => {
  let received;
  await runJest("C:/fixture", ["tests/missing.test.mjs"], async (...args) => {
    received = args;
    return { code: 0, stdout: "", stderr: "" };
  });
  expect(received[1]).toEqual([
    "node_modules/jest/bin/jest.js",
    "--coverage",
    "--runTestsByPath",
    "tests/missing.test.mjs",
    "--runInBand",
  ]);
});

test("keeps broad coverage for a non-test focused path", async () => {
  let received;
  await runJest("C:/fixture", ["tests/helper.mjs"], async (...args) => {
    received = args;
    return { code: 0, stdout: "", stderr: "" };
  });
  expect(received[1]).not.toContain("--collectCoverageFrom");
});
