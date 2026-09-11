import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.9.0.mjs";

test("accepts v8 apply groups and top-level exemptions", () => {
  expect(
    run({
      packageJson: {
        eliware: {
          conventions: { version: "8.0", apply: ["general"] },
          exempt: [],
        },
      },
    }),
  ).toMatchObject({ ruleId: "E-1.9.0", status: "pass" });
});

test("rejects the retired nested exemptions field", () => {
  expect(
    run({
      packageJson: {
        eliware: { conventions: { version: "8.0", apply: ["general"], exemptions: [] } },
      },
    }),
  ).toMatchObject({ ruleId: "E-1.9.0", status: "fail" });
});
