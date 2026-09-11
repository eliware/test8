export function validateExemptionIds(conventions, checks) {
  const knownIds = new Set(checks.map(({ ruleId }) => ruleId));
  const unknown = (conventions.exemptions ?? [])
    .map(({ ruleId }) => ruleId)
    .filter((ruleId) => !knownIds.has(ruleId));
  if (unknown.length > 0) {
    throw new Error(`Unknown convention exemption rule ID: ${unknown.join(", ")}.`);
  }
}
