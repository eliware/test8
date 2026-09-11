import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.20.1";

export function run({ packageJson }) {
  const declaration = packageJson?.engines?.node;
  if (typeof declaration !== "string" || !/(^|[>^~]=?\s*)26(?:\.|\s|$)/.test(declaration)) {
    return fail(ruleId, "package.json must declare compatibility with Node 26 or newer.");
  }
  return pass(ruleId);
}
