import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.1.0";
export const parentRuleId = "E-1.1";

const sections = ["Purpose", "Requirements", "Setup", "Configuration", "Usage", "Validation", "Operations", "Security", "Support", "License"];

function sectionContent(readme, section) {
  const lines = readme.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => new RegExp(`^#{1,6}\\s+${section}\\b`, "i").test(line));
  if (headingIndex < 0) return "";
  const end = lines.findIndex((line, index) => index > headingIndex && /^#{1,6}\s+\S/.test(line));
  return lines.slice(headingIndex + 1, end < 0 ? lines.length : end).join("\n").trim();
}

export async function run({ root, packageJson }) {
  let readme;
  try {
    readme = await readFile(join(root, "README.md"), "utf8");
  } catch {
    return fail(ruleId, "README.md is required.");
  }
  const missing = sections.filter((section) => !sectionContent(readme, section));
  if (missing.length > 0) return fail(ruleId, `README.md is missing required sections: ${missing.join(", ")}.`);
  if (!readme.includes("eliware.org/logos/brand.png") || !readme.includes("github.com")) {
    return fail(ruleId, "README.md must use the standard Eliware branding and repository link.");
  }
  if (!readme.includes("actions/workflows/") || !readme.includes("badge.svg")) {
    return fail(ruleId, "README.md must include a GitHub CI badge.");
  }
  if (!readme.includes("[license]") && !readme.includes("(LICENSE)")) {
    return fail(ruleId, "README.md must include a license badge or LICENSE link.");
  }
  if (packageJson?.publishConfig?.access === "public" && !readme.includes("npmjs.com")) {
    return fail(ruleId, "Public npm packages must include an npm version badge or npm link.");
  }
  const metadata = [
    [packageJson?.description, "project description"],
    [packageJson?.author?.name ?? packageJson?.author, "author"],
    [packageJson?.repository?.url ?? packageJson?.repository, "repository"],
    [packageJson?.license, "license"],
  ];
  const missingMetadata = metadata.filter(([value]) => value && !readme.includes(String(value))).map(([, label]) => label);
  if (missingMetadata.length > 0) {
    return fail(ruleId, `README.md must state package metadata: ${missingMetadata.join(", ")}.`);
  }
  const keywords = Array.isArray(packageJson?.keywords) ? packageJson.keywords.filter(Boolean) : [];
  if (keywords.length > 0 && !keywords.every((keyword) => readme.includes(String(keyword)))) {
    return fail(ruleId, "README.md must state the package keywords.");
  }
  if (!sectionContent(readme, "Support")) {
    return fail(ruleId, "README.md must state support channels.");
  }
  return pass(ruleId);
}
