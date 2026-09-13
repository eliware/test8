import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.20.16";
export const parentRuleId = "E-1.20";

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else if (entry.isFile() && entry.name.endsWith(".mjs")) files.push(path);
  }
  return files;
}

async function overLimit(root, directory, limit) {
  const files = await collect(join(root, directory));
  const violations = [];
  for (const file of files) {
    const lines = (await readFile(file, "utf8")).split(/\r?\n/).length - 1;
    if (lines > limit) violations.push(`${relative(root, file).replaceAll("\\", "/")} (${lines} > ${limit})`);
  }
  return violations;
}

export async function run({ root }) {
  let sourceViolations;
  let testViolations;
  try {
    [sourceViolations, testViolations] = await Promise.all([
      overLimit(root, "src", 100),
      overLimit(root, "tests", 200),
    ]);
  } catch {
    return fail(ruleId, "src/ and tests/ are required for monolith-limit validation.");
  }
  const violations = [...sourceViolations, ...testViolations];
  if (violations.length > 0) return fail(ruleId, `Monolith limits exceeded: ${violations.join(", ")}.`);
  return pass(ruleId);
}
