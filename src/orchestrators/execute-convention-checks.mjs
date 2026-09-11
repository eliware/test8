import { assertCheckResult } from "../checks/check-result.mjs";

export async function executeConventionChecks(checks, context, exemptions) {
  const results = [];
  for (const check of checks) {
    if (exemptions.has(check.ruleId)) continue;
    results.push(assertCheckResult(await check.run(context), check.ruleId));
  }
  return results;
}
