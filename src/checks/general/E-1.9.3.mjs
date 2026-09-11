import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.9.3";
export function run({ packageJson }) {
  const entries = packageJson?.eliware?.conventions?.exemptions ?? [];
  return Array.isArray(entries) &&
    entries.every(
      (entry) =>
        typeof entry?.ruleId === "string" && entry.reason && entry.approver && entry.approvalDate,
    )
    ? pass(ruleId)
    : fail(ruleId, "Convention exemptions require ruleId, reason, approver, and approvalDate.");
}
