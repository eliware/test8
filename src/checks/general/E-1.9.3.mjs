import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.9.3";
export function run({ packageJson }) {
  const entries = packageJson?.eliware?.exempt ?? [];
  return Array.isArray(entries) &&
    entries.every(
      (entry) =>
        typeof entry?.ruleId === "string" &&
        entry.reason &&
        entry.approver === "Eli" &&
        entry.approvalTimestamp &&
        (entry.expiry === null || typeof entry.expiry === "string"),
    )
    ? pass(ruleId)
    : fail(
        ruleId,
        "Convention exemptions require ruleId, reason, Eli approver, approvalTimestamp, and expiry.",
      );
}
