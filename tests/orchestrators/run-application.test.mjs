import { expect, test } from "@jest/globals";
import { runApplication } from "../../src/orchestrators/run-application.mjs";

test("composes all validation stages through the lifecycle", async () => {
  const calls = [];
  const result = await runApplication({
    root: "C:/repo",
    args: [],
    packageJson: {},
    runLifecycle: async (stages) => {
      for (const name of ["runConventions", "runTests", "runCoverage", "runLint", "runPackage"]) {
        await stages[name]();
        calls.push(name);
      }
      return { code: 0, results: [] };
    },
    runConventions: async () => ({ code: 0 }),
    runTests: async () => ({ code: 0 }),
    runCoverage: async () => ({ code: 0 }),
    runLint: async () => ({ code: 0 }),
    runPackage: async () => ({ code: 0 }),
  });
  expect(result.code).toBe(0);
  expect(calls).toEqual(["runConventions", "runTests", "runCoverage", "runLint", "runPackage"]);
});

test("composes default stages with the expected arguments", async () => {
  const calls = [];
  const defaults = {
    runConventions: async (ignoredRuleIds) => {
      calls.push(["conventions", ignoredRuleIds]);
      return { code: 0 };
    },
    runTests: async (args) => {
      calls.push(["tests", args]);
      return { code: 0 };
    },
    runCoverage: async () => {
      calls.push(["coverage"]);
      return { code: 0 };
    },
    runLint: async () => {
      calls.push(["lint"]);
      return { code: 0 };
    },
    runPackage: async (packageJson, root) => {
      calls.push(["package", packageJson, root]);
      return { code: 0 };
    },
  };
  await expect(
    runApplication({
      root: "C:/repo",
      args: ["tests/example.test.mjs"],
      packageJson: { name: "fixture" },
      diagnosticOptions: { ignoredRuleIds: ["E-1.3"] },
      createStages: () => defaults,
    }),
  ).resolves.toMatchObject({ code: 0, results: expect.any(Array) });
  expect(calls).toEqual([
    ["conventions", ["E-1.3"]],
    ["tests", ["tests/example.test.mjs"]],
    ["coverage"],
    ["lint"],
    ["package", { name: "fixture" }, "C:/repo"],
  ]);
});
