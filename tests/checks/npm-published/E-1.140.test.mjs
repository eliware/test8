import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/npm-published/E-1.140.mjs";

test("passes public packages", () => {
  expect(run({ packageJson: { private: false } })).toMatchObject({
    status: "pass",
    ruleId: "E-1.140",
  });
});

test("fails private packages", () => {
  expect(run({ packageJson: { private: true } })).toMatchObject({
    status: "fail",
    ruleId: "E-1.140",
  });
});
