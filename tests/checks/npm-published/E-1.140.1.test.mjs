import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/npm-published/E-1.140.1.mjs";

test("passes packages with audit and pack scripts", () => {
  expect(run({ packageJson: { scripts: { audit: "npm audit", pack: "npm pack" } } })).toMatchObject(
    {
      status: "pass",
      ruleId: "E-1.140.1",
    },
  );
});

test("fails when a required publication script is absent", () => {
  expect(run({ packageJson: { scripts: { audit: "npm audit" } } })).toMatchObject({
    status: "fail",
    ruleId: "E-1.140.1",
  });
});
