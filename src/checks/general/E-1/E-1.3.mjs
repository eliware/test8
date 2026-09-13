import { fail, pass } from "../../check-result.mjs";

export const ruleId = "E-1.3";
export const parentRuleId = "E-1";

const directToolPattern = /(?:^|[\s&;|])(?:jest|oxlint|prettier)(?:\s|$)/i;
const directDependencyNames = new Set(["jest", "oxlint", "prettier"]);

export function run({ packageJson }) {
  const scripts = packageJson?.scripts ?? {};
  const invalidScripts = Object.entries(scripts)
    .filter(([, command]) => typeof command === "string" && directToolPattern.test(command))
    .map(([name]) => name);
  if (invalidScripts.length > 0) {
    return fail(ruleId, `Validation scripts must use eliware-test rather than direct tools: ${invalidScripts.join(", ")}.`);
  }
  const dependencies = new Set([
    ...Object.keys(packageJson?.dependencies ?? {}),
    ...Object.keys(packageJson?.devDependencies ?? {}),
    ...Object.keys(packageJson?.optionalDependencies ?? {}),
  ]);
  const directTools = [...dependencies].filter((name) => directDependencyNames.has(name));
  if (directTools.length > 0) {
    return fail(ruleId, `Repositories must not directly declare shared validation tools: ${directTools.join(", ")}.`);
  }
  return pass(ruleId);
}
