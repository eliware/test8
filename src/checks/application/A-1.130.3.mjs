import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.130.3";
export function run({ packageJson }) {
  const scripts = packageJson?.scripts ?? {};
  return scripts.start || scripts.dev || packageJson?.bin
    ? pass(ruleId)
    : fail(ruleId, "Application package.json must declare a runtime/start entrypoint.");
}
