import { expect, test } from "@jest/globals";
import { createDefaultStages } from "../../src/orchestrators/create-default-stages.mjs";

test("creates all lifecycle stage functions for a repository", () => {
  const stages = createDefaultStages("C:/repo", { scripts: {} });
  expect(Object.keys(stages).sort()).toEqual([
    "runConventions",
    "runCoverage",
    "runLint",
    "runPackage",
    "runTests",
  ]);
  for (const stage of Object.values(stages)) expect(typeof stage).toBe("function");
});

test("creates callable default stages with normalized results", async () => {
  const stages = createDefaultStages(process.cwd(), { scripts: {} });
  await expect(stages.runConventions()).resolves.toMatchObject({ category: "conventions" });
  await expect(stages.runTests(["--help"])).resolves.toMatchObject({ category: "tests" });
  await expect(stages.runCoverage()).resolves.toMatchObject({ category: "coverage" });
  await expect(stages.runLint()).resolves.toMatchObject({ category: expect.any(String) });
  await expect(stages.runPackage()).resolves.toMatchObject({ code: 0 });
});

test("runs optional package scripts through the injected child-process seam", async () => {
  let received;
  const stages = createDefaultStages(
    "C:/repo",
    { scripts: { audit: "npm audit" } },
    {
      executePackage: async (...args) => {
        received = args;
        return { code: 0, stdout: "audit ok", stderr: "" };
      },
    },
  );
  await expect(stages.runPackage()).resolves.toMatchObject({ code: 0 });
  expect(received[1].slice(-2)).toEqual(["run", "audit"]);
  expect(received[2]).toEqual({ cwd: "C:/repo" });
});
