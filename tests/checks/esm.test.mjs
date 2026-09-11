import { expect, test } from "@jest/globals";
import { assertCheckResult } from "../../src/checks/check-result.mjs";
import { run } from "../../src/checks/node/E-1.20.2.mjs";

test("passes when package.json declares native ESM", () => {
  expect(run({ packageJson: { type: "module" } })).toEqual({
    ruleId: "E-1.20.2",
    status: "pass",
    message: "",
  });
});

test("fails when package.json does not declare native ESM", () => {
  const result = run({ packageJson: { type: "commonjs" } });
  expect(result.status).toBe("fail");
  expect(result.message).toMatch(/type.*module/);
});

test("rejects a check result with the wrong rule identity", () => {
  expect(() => assertCheckResult({ ruleId: "wrong", status: "pass" }, "E-1.20.2")).toThrow(
    /invalid result/,
  );
});
