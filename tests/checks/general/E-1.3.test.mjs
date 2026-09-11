import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.3.mjs";

test("accepts the exact consumer test command", () => {
  expect(run({ packageJson: { scripts: { test: "eliware-test" } } })).toMatchObject({
    ruleId: "E-1.3",
    status: "pass",
  });
});

test("rejects appended commands and direct Jest commands", () => {
  for (const command of ["eliware-test --lint", "eliware-test && npm run build", "jest"]) {
    expect(run({ packageJson: { scripts: { test: command } } })).toMatchObject({
      ruleId: "E-1.3",
      status: "fail",
    });
  }
});
