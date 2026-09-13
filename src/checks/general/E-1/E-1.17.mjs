import { access, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fail, pass } from "../../check-result.mjs";

export const ruleId = "E-1.17";
export const parentRuleId = "E-1";

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else if (entry.isFile() && entry.name.endsWith(".mjs")) files.push(path);
  }
  return files;
}

export async function run({ root }) {
  let sourceFiles;
  try {
    sourceFiles = await collect(join(root, "src"));
  } catch {
    return fail(ruleId, "src/ is required for source/test mirroring.");
  }
  const missing = [];
  for (const source of sourceFiles) {
    const relativeSource = relative(join(root, "src"), source);
    const expected = join(root, "tests", relativeSource.replace(/\.mjs$/, ".test.mjs"));
    try {
      await access(expected);
    } catch {
      missing.push(relativeSource.replaceAll("\\", "/"));
    }
  }
  if (missing.length > 0) {
    return fail(ruleId, `Every source module requires a mirrored test file: ${missing.join(", ")}.`);
  }
  return pass(ruleId);
}
