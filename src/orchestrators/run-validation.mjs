import { readConventionConfig } from "./read-convention-config.mjs";
import { readExemptions } from "./read-exemptions.mjs";
import { selectConventionChecks } from "./select-convention-checks.mjs";
import { discoverAllChecks } from "./discover-checks.mjs";
import { validateExemptionIds } from "./validate-exemption-ids.mjs";
import { executeConventionChecks } from "./execute-convention-checks.mjs";
import { readPackageJson } from "../cli/read-package-json.mjs";

export async function runValidation(root, ignoredRuleIds = [], options = {}) {
  const packageJson = await readPackageJson(root);
  const conventions = readConventionConfig(packageJson);
  const allChecks = await discoverAllChecks();
  const checks = await selectConventionChecks(conventions);
  validateExemptionIds(packageJson, allChecks);
  const exemptions = readExemptions(packageJson);
  const context = {
    root,
    packageJson,
    executeJest: options.executeJest === true,
    executeLint: options.executeLint === true,
    executeAudit: options.executeAudit === true,
    executePack: options.executePack === true,
    mode: options.mode ?? null,
    jestArgs: options.jestArgs ?? [],
  };
  return executeConventionChecks(checks, context, new Set([...exemptions, ...ignoredRuleIds]));
}
