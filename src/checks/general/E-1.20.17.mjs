import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.20.17";

const requiredScripts = {
  test: "eliware-test",
  lint: "eliware-test --lint",
  audit: "eliware-test --audit",
  format: "eliware-test --format",
  "format:check": "eliware-test --format-check",
};

export function run({ packageJson }) {
  const scripts = packageJson?.scripts ?? {};
  const mismatches = Object.entries(requiredScripts)
    .filter(([name, command]) => scripts[name] !== command)
    .map(([name, command]) => `${name}=${command}`);
  return mismatches.length === 0
    ? pass(ruleId)
    : fail(ruleId, `Shared validation scripts must be exact: ${mismatches.join(", ")}.`);
}
