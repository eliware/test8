import { fail, pass } from "../check-result.mjs";

export const ruleId = "E-1.50.1";

export function run({ packageJson }) {
  const eliware = packageJson?.eliware ?? {};
  if (eliware.webRoot !== undefined && typeof eliware.webRoot !== "string") {
    return fail(ruleId, "eliware.webRoot must be a non-empty string when declared.");
  }
  if (typeof eliware.webRoot === "string" && eliware.webRoot.trim() === "") {
    return fail(ruleId, "eliware.webRoot must be a non-empty string when declared.");
  }
  if (eliware.webAssetExcludes !== undefined && !Array.isArray(eliware.webAssetExcludes)) {
    return fail(ruleId, "eliware.webAssetExcludes must be a string array when declared.");
  }
  if (
    Array.isArray(eliware.webAssetExcludes) &&
    eliware.webAssetExcludes.some((entry) => typeof entry !== "string")
  ) {
    return fail(ruleId, "eliware.webAssetExcludes must contain only strings.");
  }
  return pass(ruleId);
}
