import { fail, pass } from "../../../check-result.mjs";
import { findPureBarrels } from "./find-pure-barrels.mjs";

export const ruleId = "E-1.20.15";
export const parentRuleId = "E-1.20";

function publicEntrypoints(packageJson) {
  const exports = packageJson?.exports;
  const values = typeof exports === "string" ? [exports] : Array.isArray(exports) ? exports : [];
  if (exports && typeof exports === "object" && !Array.isArray(exports)) {
    const collect = (value) => {
      if (typeof value === "string") return [value];
      if (!value || typeof value !== "object") return [];
      return Object.values(value).flatMap(collect);
    };
    values.push(...collect(exports));
  }
  return new Set([packageJson?.main, packageJson?.module, ...values].filter(Boolean));
}

export async function run({ root, packageJson }) {
  const barrels = await findPureBarrels(root);
  if (barrels.length === 0) return pass(ruleId);
  const isLibrary = packageJson?.eliware?.apply?.includes("library");
  const allowed = publicEntrypoints(packageJson);
  const internal = barrels.filter((file) => !isLibrary || !allowed.has(file));
  return internal.length === 0
    ? pass(ruleId)
    : fail(ruleId, `Internal pure export barrels are not allowed: ${internal.join(", ")}.`);
}
