import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-18.6.0";

const optionalScripts = ["audit", "pack", "build", "typecheck"];

export function run({ packageJson }) {
  const scripts = packageJson?.scripts ?? {};
  const invalid = optionalScripts.filter(
    (name) =>
      Object.hasOwn(scripts, name) &&
      (typeof scripts[name] !== "string" || scripts[name].trim() === ""),
  );
  return invalid.length === 0
    ? pass(ruleId)
    : fail(ruleId, `Defined package scripts must be non-empty: ${invalid.join(", ")}.`);
}
