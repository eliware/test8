import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.20.11";

export function run({ packageJson }) {
  const scripts = packageJson?.scripts ?? {};
  const declared = ["typecheck", "build"].filter((name) => name in scripts);
  const invalid = declared.filter(
    (name) => typeof scripts[name] !== "string" || !scripts[name].trim(),
  );
  return invalid.length === 0
    ? pass(ruleId)
    : fail(ruleId, `Declared validation scripts must be nonempty: ${invalid.join(", ")}.`);
}
