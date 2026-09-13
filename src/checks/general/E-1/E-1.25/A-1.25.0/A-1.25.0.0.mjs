import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fail, pass } from "../../../../check-result.mjs";

export const ruleId = "A-1.25.0.0";
export const parentRuleId = "A-1.25.0";

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules", "coverage", "build", "dist"].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else if (entry.isFile() && entry.name.endsWith(".json")) files.push(path);
  }
  return files;
}

export async function run({ root }) {
  let files;
  try {
    files = await collect(root);
    for (const file of files) {
      const document = JSON.parse(await readFile(file, "utf8"));
      const references = [];
      const visit = (value) => {
        if (!value || typeof value !== "object") return;
        if (!Array.isArray(value) && typeof value.path === "string") references.push(value.path);
        for (const child of Object.values(value)) visit(child);
      };
      visit(document);
      for (const reference of references.filter((value) => value.startsWith("./"))) {
        const target = resolve(join(file, ".."), reference);
        try {
          await readFile(target);
        } catch {
          return fail(ruleId, `Structured reference does not resolve: ${reference} in ${file}.`);
        }
      }
    }
  } catch {
    return fail(ruleId, "Structured JSON references must be valid and resolvable.");
  }
  return pass(ruleId);
}
