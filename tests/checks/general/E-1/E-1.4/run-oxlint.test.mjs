import { expect, test } from "@jest/globals";
import { buildOxlintArguments, runOxlint } from "../../../../../src/checks/general/E-1/E-1.4/run-oxlint.mjs";

test("builds strict warning-denying Oxlint arguments", () => {
  expect(buildOxlintArguments()).toEqual(["--deny-warnings", "."]);
});

test("runs Oxlint through an injected argument-array executor", async () => {
  const calls = [];
  const result = await runOxlint("C:/repo", async (...args) => {
    calls.push(args);
    return { code: 0, stdout: "", stderr: "" };
  });
  expect(result.code).toBe(0);
  expect(calls[0][0]).toBe(process.execPath);
  expect(calls[0][1]).toEqual(expect.arrayContaining(["--deny-warnings", "."]));
  expect(calls[0][2]).toMatchObject({ cwd: "C:/repo" });
});
