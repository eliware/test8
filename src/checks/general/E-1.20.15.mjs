import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.20.15";
export function run({ root, packageJson, barrelFiles = [] }) {
  if (barrelFiles.length === 0) return pass(ruleId);
  const allowed = new Set(
    [packageJson?.main, ...(Array.isArray(packageJson?.exports) ? packageJson.exports : [])].filter(
      Boolean,
    ),
  );
  const internal = barrelFiles.filter(
    (file) => !allowed.has(file.replace(`${root}\\`, "").replaceAll("\\", "/")),
  );
  return internal.length === 0
    ? pass(ruleId)
    : fail(ruleId, `Internal pure export barrels are not allowed: ${internal.join(", ")}.`);
}
