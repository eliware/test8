import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.140.1";

export function run({ packageJson }) {
  const scripts = packageJson?.scripts ?? {};
  const missing = ["pack", "audit"].filter(
    (name) => typeof scripts[name] !== "string" || !scripts[name].trim(),
  );
  return missing.length === 0
    ? pass(ruleId)
    : fail(ruleId, `npm-published repositories require scripts: ${missing.join(", ")}.`);
}
