import { fail, pass } from "../../check-result.mjs";

export const ruleId = "E-1.140.1";
export const parentRuleId = "E-1.140";

export function run({ packageJson }) {
  if (typeof packageJson?.engines?.node !== "string" || !/26/.test(packageJson.engines.node)) {
    return fail(ruleId, "Public npm packages must declare Node.js 26 compatibility.");
  }
  if (packageJson?.publishConfig?.provenance !== true) return fail(ruleId, "Public npm packages must enable npm provenance.");
  const files = packageJson?.files;
  const required = ["README.md", "LICENSE", "RELEASE_NOTES.md", "docs/", "specs/"];
  if (!Array.isArray(files) || !required.every((value) => files.includes(value) || files.includes(value.slice(0, -1)))) {
    return fail(ruleId, "Public npm packages must provide a files allowlist containing README.md, LICENSE, RELEASE_NOTES.md, docs/, and specs/.");
  }
  if (packageJson?.scripts?.pack !== "eliware-test --pack") return fail(ruleId, "Public npm packages must define pack=eliware-test --pack.");
  return pass(ruleId);
}
