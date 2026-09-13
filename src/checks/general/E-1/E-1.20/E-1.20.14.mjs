import { readFile } from "node:fs/promises";
import { fail, pass } from "../../../check-result.mjs";
import { findRepositoryFiles } from "../find-repository-files.mjs";

export const ruleId = "E-1.20.14";
export const parentRuleId = "E-1.20";

function escaped(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function run({ root, packageJson, referencedDependencies }) {
  const declared = Object.keys({
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies,
    ...packageJson?.optionalDependencies,
  });
  if (declared.length === 0) return pass(ruleId);
  const referenced = new Set(referencedDependencies ?? []);
  if (referencedDependencies === undefined) {
    let files;
    try {
      files = (await findRepositoryFiles(root)).filter((file) =>
        /\.(?:mjs|js|cjs|ts|tsx|json|ya?ml)$/i.test(file) && !/^package(?:-lock)?\.json$/i.test(file),
      );
      const contents = await Promise.all(files.map((file) => readFile(`${root}/${file}`, "utf8")));
      for (const name of declared) {
        const pattern = new RegExp(`(?:from\\s*["']|import\\s*\\(|require\\s*\\(|extends\\s*["']|["']${escaped(name)}(?:/|["']))`, "m");
        if (contents.some((content) => pattern.test(content))) referenced.add(name);
      }
      if (packageJson?.jest && declared.includes("jest")) referenced.add("jest");
      if (packageJson?.prettier && declared.includes("prettier")) referenced.add("prettier");
      if (packageJson?.scripts && declared.includes("oxlint") && Object.values(packageJson.scripts).some((script) => /lint/i.test(script))) referenced.add("oxlint");
    } catch (error) {
      return fail(ruleId, `Dependency usage could not be inspected: ${error.message}`);
    }
  }
  const unused = declared.filter((name) => !referenced.has(name));
  if (unused.length > 0) return fail(ruleId, `Unused direct dependencies: ${unused.join(", ")}.`);
  return pass(ruleId);
}
