import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.7.mjs";

test("requires Jest configuration in package.json", () => {
  expect(run({ packageJson: { jest: {} } })).toEqual({ ruleId: "E-1.20.7", status: "pass", message: "" });
  expect(run({ packageJson: {} })).toEqual(expect.objectContaining({ status: "fail" }));
});
