import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.20.17";
const requiredScripts = ["test", "lint", "format", "format:check"];

export function run({ packageJson }) {
  const scripts = packageJson?.scripts ?? {};
  const missing = requiredScripts.filter(
    (name) => typeof scripts[name] !== "string" || !scripts[name].trim(),
  );
  if (missing.length > 0)
    return fail(ruleId, `Required package scripts are missing or empty: ${missing.join(", ")}.`);
  return pass(ruleId);
}
