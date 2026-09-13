import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.17.mjs";

const scripts = {
  test: "eliware-test",
  lint: "eliware-test --lint",
  audit: "eliware-test --audit",
  format: "eliware-test --format",
  "format:check": "eliware-test --format-check",
};

test("requires the exact shared validation scripts", () => {
  expect(run({ packageJson: { scripts } })).toEqual({ ruleId: "E-1.20.17", status: "pass", message: "" });
  expect(run({ packageJson: { scripts: { ...scripts, test: "jest" } } })).toEqual(expect.objectContaining({ status: "fail" }));
});
