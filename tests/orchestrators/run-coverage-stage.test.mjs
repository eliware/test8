import { expect, test } from "@jest/globals";
import { runCoverageStage } from "../../src/orchestrators/run-coverage-stage.mjs";

test("returns coverage success for complete evidence", async () => {
  const result = await runCoverageStage(async () => ({
    statements: 100,
    branches: 100,
    functions: 100,
    lines: 100,
  }));
  expect(result).toEqual({ code: 0, category: "coverage", gaps: [] });
});

test("returns a coverage failure for incomplete evidence", async () => {
  const result = await runCoverageStage(async () => ({
    statements: 100,
    branches: 99,
    functions: 100,
    lines: 100,
  }));
  expect(result).toEqual({ code: 10, category: "coverage", gaps: ["branches"] });
});

test("returns an internal failure for unreadable evidence", async () => {
  const result = await runCoverageStage(async () => {
    throw new Error("missing coverage");
  });
  expect(result).toEqual({ code: 14, category: "internal", gaps: [], output: "missing coverage" });
});
