import { expect, test } from "@jest/globals";
import { buildAuditArguments, runNpmAudit } from "../../../../../src/checks/general/E-1/E-1.20/run-npm-audit.mjs";

test("builds the strict JSON audit command", () => {
  expect(buildAuditArguments()).toEqual(["audit", "--json", "--audit-level=high"]);
});

test("runs npm audit in the repository root", async () => {
  const calls = [];
  const result = await runNpmAudit("C:\\repo", async (...args) => {
    calls.push(args);
    return { code: 0, signal: null, stdout: "", stderr: "" };
  });

  expect(result.code).toBe(0);
  expect(calls).toHaveLength(1);
  expect(calls[0][1].slice(-3)).toEqual(["audit", "--json", "--audit-level=high"]);
  expect(calls[0][2]).toEqual({ cwd: "C:\\repo" });
});
