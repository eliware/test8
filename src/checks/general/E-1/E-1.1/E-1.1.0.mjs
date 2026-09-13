import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.1.0";
export const parentRuleId = "E-1.1";

const sections = ["Purpose", "Requirements", "Setup", "Configuration", "Usage", "Validation", "Operations", "Security", "Support", "License"];

export async function run({ root, packageJson }) {
  let readme;
  try {
    readme = await readFile(join(root, "README.md"), "utf8");
  } catch {
    return fail(ruleId, "README.md is required.");
  }
  const missing = sections.filter((section) => !new RegExp(`^#{1,6}\\s+${section}\\b`, "im").test(readme));
  if (missing.length > 0) return fail(ruleId, `README.md is missing required sections: ${missing.join(", ")}.`);
  if (!readme.includes("eliware.org/logos/brand.png") || !readme.includes("github.com")) {
    return fail(ruleId, "README.md must use the standard Eliware branding and repository link.");
  }
  if (!readme.includes("[license]") && !readme.includes("(LICENSE)")) {
    return fail(ruleId, "README.md must include a license badge or LICENSE link.");
  }
  if (packageJson?.publishConfig?.access === "public" && !readme.includes("npmjs.com")) {
    return fail(ruleId, "Public npm packages must include an npm version badge or npm link.");
  }
  return pass(ruleId);
}
