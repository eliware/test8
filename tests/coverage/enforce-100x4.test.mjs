import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { evaluateCoverage } from "../../src/coverage/evaluate-coverage.mjs";
import { runCoverageCommand } from "../../src/cli/run-coverage-command.mjs";

const complete = { statements: 100, branches: 100, functions: 100, lines: 100 };

test("passes when all four coverage metrics are 100", () => {
  expect(evaluateCoverage(complete)).toEqual({ status: "pass", gaps: [] });
});

test("fails independently for incomplete metrics", () => {
  const result = evaluateCoverage({ ...complete, branches: 0, lines: 99 });
  expect(result).toEqual({ status: "fail", gaps: ["branches", "lines"] });
});

test("fails when coverage evidence is missing", () => {
  expect(evaluateCoverage(null)).toEqual({
    status: "fail",
    gaps: ["statements", "branches", "functions", "lines"],
  });
});

test("coverage opt-out preserves collection but suppresses only coverage failure code", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-coverage-"));
  await mkdir(join(root, "coverage"));
  await writeFile(
    join(root, "coverage", "coverage-summary.json"),
    JSON.stringify({
      total: {
        statements: { pct: 99 },
        branches: { pct: 100 },
        functions: { pct: 100 },
        lines: { pct: 100 },
      },
    }),
  );
  expect((await runCoverageCommand(root, true)).code).toBe(0);
  expect((await runCoverageCommand(root, false)).code).toBe(10);
});

test("coverage opt-out does not suppress internal evidence failures", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-coverage-missing-"));
  expect((await runCoverageCommand(root, true)).code).toBe(14);
});

test("uses the next standard coverage report when the primary is absent", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-coverage-candidate-"));
  await mkdir(join(root, "coverage"));
  await writeFile(
    join(root, "coverage", "coverage.json"),
    JSON.stringify({
      total: {
        statements: { pct: 100 },
        branches: { pct: 100 },
        functions: { pct: 100 },
        lines: { pct: 100 },
      },
    }),
  );
  expect((await runCoverageCommand(root, false)).code).toBe(0);
});

test("skips malformed primary evidence when a later report is usable", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-coverage-fallback-"));
  await mkdir(join(root, "coverage"));
  await writeFile(join(root, "coverage", "coverage-summary.json"), "not-json");
  await writeFile(
    join(root, "coverage", "coverage.json"),
    JSON.stringify({
      total: {
        statements: { pct: 100 },
        branches: { pct: 100 },
        functions: { pct: 100 },
        lines: { pct: 100 },
      },
    }),
  );
  expect((await runCoverageCommand(root, false)).code).toBe(0);
});
