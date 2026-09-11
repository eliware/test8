import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-18.0.0";

export function run({ packageJson }) {
  const lint = packageJson?.scripts?.lint;
  return typeof lint === "string" && /^\s*eliware-test\s+--lint(?:\s|$)/.test(lint)
    ? pass(ruleId)
    : fail(ruleId, "package.json scripts.lint must invoke eliware-test --lint.");
}
