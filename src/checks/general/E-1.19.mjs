import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.19";

export function run({ packageJson }) {
  const required = [
    ["name", typeof packageJson?.name === "string" && packageJson.name.length > 0],
    ["version", typeof packageJson?.version === "string" && packageJson.version.length > 0],
    [
      "description",
      typeof packageJson?.description === "string" && packageJson.description.length > 0,
    ],
    ["type", packageJson?.type === "module"],
  ];
  const missing = required.filter(([, valid]) => !valid).map(([name]) => name);
  if (missing.length > 0)
    return fail(ruleId, `package.json metadata is missing or invalid: ${missing.join(", ")}.`);
  return pass(ruleId);
}
