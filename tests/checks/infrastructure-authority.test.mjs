import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/infrastructure/A-1.90.0.5.mjs";

test("accepts infrastructure metadata with an authority record", () => {
  expect(run({ packageJson: { eliware: { authority: "eliware/docs" } } })).toEqual({
    ruleId: "A-1.90.0.5",
    status: "pass",
    message: "",
  });
});

test.each([
  {},
  { packageJson: {} },
  { packageJson: { eliware: {} } },
  { packageJson: { eliware: { authority: "" } } },
])("rejects missing infrastructure authority: %j", (input) => {
  expect(run(input)).toEqual({
    ruleId: "A-1.90.0.5",
    status: "fail",
    message: "Infrastructure subtypes require an explicit authority record.",
  });
});
