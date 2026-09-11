import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { readConventionConfig } from "./read-convention-config.mjs";
import { readExemptions } from "./read-exemptions.mjs";
import { selectConventionChecks } from "./select-convention-checks.mjs";
import { validateExemptionIds } from "./validate-exemption-ids.mjs";
import { executeConventionChecks } from "./execute-convention-checks.mjs";

export async function runValidation(root, ignoredRuleIds = []) {
  const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  const conventions = readConventionConfig(packageJson);
  const checks = await selectConventionChecks(conventions);
  validateExemptionIds(conventions, checks);
  const exemptions = readExemptions(conventions);
  const context = { root, packageJson };
  return executeConventionChecks(checks, context, new Set([...exemptions, ...ignoredRuleIds]));
}
