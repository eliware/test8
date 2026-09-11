import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.9.mjs";

test("accepts an object-valued conventions section", () => {
  expect(run({ packageJson: { eliware: { conventions: { version: "8.0" } } } })).toMatchObject({
    ruleId: "E-1.9",
    status: "pass",
  });
});

test("rejects missing or non-object conventions metadata", () => {
  for (const packageJson of [{}, { eliware: { conventions: [] } }]) {
    expect(run({ packageJson })).toMatchObject({ ruleId: "E-1.9", status: "fail" });
  }
});
