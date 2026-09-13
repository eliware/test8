import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.9/E-1.9.3.mjs";

const valid = { ruleId: "E-1.20.10", reason: "fixture", approver: "Eli", approvalTimestamp: "2026-09-13T00:00:00Z", expiry: "2026-09-30" };

test("accepts approved permanent and temporary exemption metadata", () => {
  expect(run({ packageJson: { eliware: { exempt: [valid, { ...valid, ruleId: "E-1.3", expiry: null }] } } })).toEqual({ ruleId: "E-1.9.3", status: "pass", message: "" });
});

test("rejects incomplete or invalid exemption metadata", () => {
  expect(run({ packageJson: { eliware: { exempt: [{ ...valid, expiry: "soon" }] } } })).toEqual(expect.objectContaining({ status: "fail" }));
});
