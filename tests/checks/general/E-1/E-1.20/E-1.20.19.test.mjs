import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.19.mjs";

test("requires the shared audit stage script", () => {
  expect(run({ packageJson: { scripts: { audit: "eliware-test --audit" } } })).toEqual({ ruleId: "E-1.20.19", status: "pass", message: "" });
  expect(run({ packageJson: { scripts: { audit: "npm audit" } } })).toEqual(expect.objectContaining({ status: "fail" }));
});
