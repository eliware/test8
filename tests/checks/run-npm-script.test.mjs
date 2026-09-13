import { expect, test } from "@jest/globals";
import { buildNpmScriptArguments, runNpmScript } from "../../src/checks/run-npm-script.mjs";

test("builds an isolated npm script invocation", () => {
  expect(buildNpmScriptArguments("build")).toEqual(["run", "build", "--silent"]);
});

test("runs a package script in the repository root", async () => {
  const calls = [];
  await expect(runNpmScript("C:\\repo", "typecheck", async (...args) => {
    calls.push(args);
    return { code: 0, stdout: "", stderr: "" };
  })).resolves.toEqual({ code: 0, stdout: "", stderr: "" });
  expect(calls[0][1].slice(-3)).toEqual(["run", "typecheck", "--silent"]);
  expect(calls[0][2]).toEqual({ cwd: "C:\\repo" });
});
