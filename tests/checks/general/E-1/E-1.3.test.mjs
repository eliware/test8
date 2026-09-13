import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/general/E-1/E-1.3.mjs";

test("rejects direct validation tools and dependencies", () => {
  expect(run({ packageJson: { scripts: { test: "jest" } } })).toEqual(expect.objectContaining({ status: "fail" }));
  expect(run({ packageJson: { devDependencies: { oxlint: "^1.0.0" } } })).toEqual(expect.objectContaining({ status: "fail" }));
});

test("accepts a package that delegates validation to the shared harness", () => {
  expect(run({ packageJson: { scripts: { test: "eliware-test", lint: "eliware-test --lint" } } })).toEqual({
    ruleId: "E-1.3",
    status: "pass",
    message: "",
  });
});
