import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.13";
export function run({ packageJson }) {
  const dependencies = { ...packageJson?.dependencies, ...packageJson?.optionalDependencies };
  const invalid = Object.entries(dependencies).filter(
    ([, range]) => typeof range !== "string" || !range.trim(),
  );
  return invalid.length === 0
    ? pass(ruleId)
    : fail(
        ruleId,
        `Direct dependency declarations are invalid: ${invalid.map(([name]) => name).join(", ")}.`,
      );
}
