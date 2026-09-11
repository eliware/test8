import { validateExemptionRecords } from "./validate-exemption-records.mjs";

export function readExemptions(conventions) {
  const records = conventions.exemptions ?? [];
  validateExemptionRecords(records);
  return new Set(records.map((entry) => entry.ruleId));
}
