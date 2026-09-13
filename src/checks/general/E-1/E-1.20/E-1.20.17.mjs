import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.20.17";
export const parentRuleId = "E-1.20";

const requiredScripts = {
  test: "eliware-test",
  lint: "eliware-test --lint",
  audit: "eliware-test --audit",
  format: "eliware-test --format",
  "format:check": "eliware-test --format-check",
};

export function run({ packageJson }) {
  const scripts = packageJson?.scripts;
  for (const [name, command] of Object.entries(requiredScripts)) {
    if (scripts?.[name] !== command) return fail(ruleId, `package.json.scripts.${name} must be exactly ${command}.`);
  }
  return pass(ruleId);
}
