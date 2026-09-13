import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.9/A-1.9.6.mjs";

test("accepts approved crosslink relationships", () => {
  expect(run({ packageJson: { eliware: { crosslinks: [{ path: "../docs", relation: "relatedAuthority" }] } } })).toEqual({ ruleId: "A-1.9.6", status: "pass", message: "" });
});

test("rejects unknown crosslink relationships", () => {
  expect(run({ packageJson: { eliware: { crosslinks: [{ path: "../docs", relation: "unknown" }] } } })).toEqual(expect.objectContaining({ status: "fail" }));
});
