import { expect, test } from "@jest/globals";
import { runLifecycle } from "../../src/orchestrators/run-lifecycle.mjs";

test("runs convention, test, coverage, and lint stages in order", async () => {
  const order = [];
  const result = await runLifecycle({
    runConventions: async () => {
      order.push("conventions");
      return { code: 0, category: "conventions" };
    },
    runTests: async () => {
      order.push("tests");
      return { code: 0, category: "tests" };
    },
    runCoverage: async () => {
      order.push("coverage");
      return { code: 0, category: "coverage" };
    },
    runLint: async () => {
      order.push("lint");
      return { code: 0, category: "lint" };
    },
    runPackage: async () => {
      order.push("package");
      return { code: 0, category: "package" };
    },
  });
  expect(order).toEqual(["conventions", "tests", "coverage", "lint", "package"]);
  expect(result.code).toBe(0);
});

test("stops before tests when convention validation fails", async () => {
  const order = [];
  const result = await runLifecycle({
    runConventions: async () => {
      order.push("conventions");
      return { code: 18, category: "conventions" };
    },
    runTests: async () => {
      order.push("tests");
      return { code: 0, category: "tests" };
    },
    runCoverage: async () => {
      order.push("coverage");
      return { code: 0, category: "coverage" };
    },
    runLint: async () => {
      order.push("lint");
      return { code: 0, category: "lint" };
    },
    runPackage: async () => {
      order.push("package");
      return { code: 0, category: "package" };
    },
  });
  expect(order).toEqual(["conventions"]);
  expect(result.code).toBe(18);
});

test("runs all post-test stages and returns the highest failure code", async () => {
  const order = [];
  const result = await runLifecycle({
    runConventions: async () => ({ code: 0, category: "conventions" }),
    runTests: async () => {
      order.push("tests");
      return { code: 9, category: "tests" };
    },
    runCoverage: async () => {
      order.push("coverage");
      return { code: 10, category: "coverage" };
    },
    runLint: async () => {
      order.push("lint");
      return { code: 12, category: "lint" };
    },
    runPackage: async () => {
      order.push("package");
      return { code: 17, category: "package" };
    },
  });
  expect(order).toEqual(["tests", "coverage", "lint", "package"]);
  expect(result.code).toBe(17);
  expect(result.results.length).toBe(5);
});
