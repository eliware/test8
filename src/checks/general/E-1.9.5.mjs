import { fail, pass } from "../check-result.mjs";
export const ruleId = "E-1.9.5";
export function run({ packageJson }) {
  const links = packageJson?.eliware?.crosslinks;
  return Array.isArray(links) &&
    links.length > 0 &&
    links.every(
      (link) =>
        typeof link?.path === "string" &&
        typeof link?.relation === "string" &&
        typeof link?.authoritativeFor === "string",
    )
    ? pass(ruleId)
    : fail(
        ruleId,
        "package.json.eliware.crosslinks must identify related paths, relationships, and authority.",
      );
}
