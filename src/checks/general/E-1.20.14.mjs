import { fail, pass } from "../check-result.mjs";
import { readFile } from "node:fs/promises";
import { walkFiles } from "./walk-files.mjs";
export const ruleId = "E-1.20.14";
export async function run({ root, packageJson, referencedDependencies = undefined }) {
  if (!referencedDependencies) {
    referencedDependencies = new Set();
    const files = (await walkFiles(root)).filter((file) =>
      /\.(?:mjs|js|cjs|ts|tsx|json)$/.test(file),
    );
    const source = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
    for (const name of Object.keys({
      ...packageJson?.dependencies,
      ...packageJson?.devDependencies,
    })) {
      if (source.includes(name)) referencedDependencies.add(name);
    }
  }
  const declared = new Set(
    Object.keys({ ...packageJson?.dependencies, ...packageJson?.devDependencies }),
  );
  const unused = [...declared].filter((name) => !referencedDependencies.has(name));
  return unused.length === 0
    ? pass(ruleId)
    : fail(ruleId, `Unused dependencies: ${unused.join(", ")}.`);
}
