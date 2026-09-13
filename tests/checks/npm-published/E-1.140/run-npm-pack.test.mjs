import { expect, test } from "@jest/globals";
import { buildPackArguments, runNpmPack } from "../../../../src/checks/npm-published/E-1.140/run-npm-pack.mjs";

test("builds the dry-run JSON pack command", () => {
  expect(buildPackArguments()).toEqual(["pack", "--dry-run", "--json"]);
});

test("runs npm pack in the repository root", async () => {
  const calls = [];
  const result = await runNpmPack("C:\\repo", async (...args) => {
    calls.push(args);
    return { code: 0, signal: null, stdout: "", stderr: "" };
  });
  expect(result.code).toBe(0);
  expect(calls).toHaveLength(1);
  expect(calls[0][1].slice(-3)).toEqual(["pack", "--dry-run", "--json"]);
  expect(calls[0][2]).toEqual({ cwd: "C:\\repo" });
});
