import { readConventionConfig } from "./read-convention-config.mjs";
import { readExemptions } from "./read-exemptions.mjs";
import { selectConventionChecks } from "./select-convention-checks.mjs";
import { validateExemptionIds } from "./validate-exemption-ids.mjs";
import { executeConventionChecks } from "./execute-convention-checks.mjs";
import { readPackageJson } from "../cli/read-package-json.mjs";

export async function runValidation(root, ignoredRuleIds = []) {
  const packageJson = await readPackageJson(root);
  const conventions = readConventionConfig(packageJson);
  const checks = await selectConventionChecks(conventions);
  validateExemptionIds(conventions, checks);
  const exemptions = readExemptions(conventions);
  const context = { root, packageJson };
  return executeConventionChecks(checks, context, new Set([...exemptions, ...ignoredRuleIds]));
}
