import { describe, expect, test } from "@jest/globals";
import { readExemptions } from "../../src/orchestrators/read-exemptions.mjs";
import { validateExemptionIds } from "../../src/orchestrators/validate-exemption-ids.mjs";
import { validateExemptionRecords } from "../../src/orchestrators/validate-exemption-records.mjs";

const valid = {
  ruleId: "E-1.3",
  reason: "The package self-hosts its CLI.",
  approver: "Eli",
  expiry: null,
  review: "Reviewed 2026-09-11",
};

describe("exemption records", () => {
  test("reads only package.json.eliware.exempt", () => {
    expect(readExemptions({ conventions: { exemptions: [valid] } })).toEqual(new Set());
    expect(readExemptions({ eliware: { exempt: [valid] } })).toEqual(new Set(["E-1.3"]));
  });

  test("requires complete authorization metadata", () => {
    for (const field of ["ruleId", "reason", "approver", "expiry", "review"]) {
      const record = { ...valid };
      delete record[field];
      expect(() => validateExemptionRecords([record])).toThrow();
    }
  });

  test("accepts a null expiry or valid ISO date and rejects invalid dates", () => {
    expect(() => validateExemptionRecords([valid])).not.toThrow();
    expect(() => validateExemptionRecords([{ ...valid, expiry: "2099-01-01" }])).not.toThrow();
    expect(() => validateExemptionRecords([{ ...valid, expiry: "tomorrow" }])).toThrow();
  });

  test("rejects duplicate and unknown rule IDs", () => {
    expect(() => validateExemptionRecords([valid, valid])).toThrow(/unique/);
    expect(() =>
      validateExemptionIds({ eliware: { exempt: [valid] } }, [{ ruleId: "E-1.3" }]),
    ).not.toThrow();
    expect(() =>
      validateExemptionIds({ eliware: { exempt: [{ ...valid, ruleId: "E-999" }] } }, [
        { ruleId: "E-1.3" },
      ]),
    ).toThrow(/Unknown convention exemption/);
  });
});
