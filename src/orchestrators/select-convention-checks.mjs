import { discoverChecks } from "./discover-checks.mjs";

export async function selectConventionChecks(conventions) {
  const groups = [...new Set(["general", ...conventions.apply])];
  return discoverChecks(groups);
}
