import { fail, pass } from "../../check-result.mjs";

export const ruleId = "E-1.19";
export const parentRuleId = "E-1";

export function run({ packageJson }) {
  const requiredStrings = ["version", "description", "author", "license"];
  if (typeof packageJson?.name !== "string" || !packageJson.name.startsWith("@eliware/")) {
    return fail(ruleId, "package.json.name must be a scoped @eliware/* name.");
  }
  if (requiredStrings.some((field) => typeof packageJson[field] !== "string" || !packageJson[field].trim())) {
    return fail(ruleId, "package.json must contain nonempty version, description, author, and license fields.");
  }
  if (packageJson.license !== "MIT" || !Array.isArray(packageJson.keywords) || packageJson.keywords.length === 0) {
    return fail(ruleId, "package.json must use the MIT license and declare nonempty keywords.");
  }
  if (!packageJson.repository || typeof packageJson.repository !== "object" || typeof packageJson.repository.url !== "string") {
    return fail(ruleId, "package.json.repository.url is required.");
  }
  if (typeof packageJson.engines?.node !== "string" || !/26/.test(packageJson.engines.node)) {
    return fail(ruleId, "package.json.engines.node must be compatible with Node.js 26.");
  }
  if (!packageJson.jest || typeof packageJson.jest !== "object") return fail(ruleId, "package.json must contain Jest configuration.");
  return pass(ruleId);
}
