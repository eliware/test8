export function validateExemptionRecords(records) {
  if (
    !Array.isArray(records) ||
    records.some((entry) => {
      return (
        !entry ||
        typeof entry !== "object" ||
        typeof entry.ruleId !== "string" ||
        !entry.ruleId ||
        typeof entry.reason !== "string" ||
        !entry.reason.trim() ||
        typeof entry.approver !== "string" ||
        !entry.approver.trim() ||
        typeof entry.approvalDate !== "string" ||
        !isValidDate(entry.approvalDate)
      );
    })
  ) {
    throw new Error("Every exemption must identify a ruleId, reason, approver, and approvalDate.");
  }
  const ids = records.map(({ ruleId }) => ruleId);
  if (new Set(ids).size !== ids.length)
    throw new Error("Convention exemption rule IDs must be unique.");
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(`${value}T`);
}
