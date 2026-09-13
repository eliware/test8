import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fail, pass } from "../../check-result.mjs";

export const ruleId = "A-1.100.3";
export const parentRuleId = "E-1.100";

async function jsonFiles(directory, root = directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await jsonFiles(file, root)));
    else if (entry.isFile() && entry.name.endsWith(".json")) result.push(file.slice(root.length + 1));
  }
  return result;
}

export async function run({ root }) {
  try {
    const files = await jsonFiles(root);
    for (const relativeFile of files) {
      const file = join(root, relativeFile);
      const document = JSON.parse(await readFile(file, "utf8"));
      const references = [];
      const visit = (value) => {
        if (!value || typeof value !== "object") return;
        if (!Array.isArray(value) && typeof value.path === "string") references.push(value.path);
        for (const child of Object.values(value)) visit(child);
      };
      visit(document);
      for (const reference of references.filter((value) => value.startsWith("./"))) {
        await readFile(resolve(dirname(file), reference));
      }
    }
  } catch (error) {
    return fail(ruleId, `Documentation reference validation failed: ${error.message}`);
  }
  return pass(ruleId);
}
