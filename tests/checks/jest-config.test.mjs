import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/E-1.20.7.mjs";

test("passes when package.json contains Jest configuration", () => {
  expect(run({ packageJson: { jest: { collectCoverage: true } } })).toEqual({
    ruleId: "E-1.20.7",
    status: "pass",
    message: "",
  });
});

test("fails when Jest configuration is absent or not an object", () => {
  const result = run({ packageJson: { jest: null } });
  expect(result.status).toBe("fail");
  expect(result.message).toMatch(/Jest/);
});

test("fails when Jest configuration is an array", () => {
  const result = run({ packageJson: { jest: [] } });
  expect(result.status).toBe("fail");
});
