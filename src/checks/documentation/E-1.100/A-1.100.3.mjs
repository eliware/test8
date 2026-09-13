import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
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

async function repositoryFiles(directory, root = directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules", "coverage", "build", "dist"].includes(entry.name)) continue;
    const file = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await repositoryFiles(file, root)));
    else if (entry.isFile() && /\.(?:json|md)$/i.test(entry.name)) result.push(file.slice(root.length + 1));
  }
  return result;
}

function localTarget(root, source, reference) {
  const clean = reference.replace(/[?#].*$/, "");
  if (!clean || /^(?:https?:|mailto:|#)/i.test(clean)) return null;
  const target = resolve(dirname(join(root, source)), clean);
  const outside = relative(root, target).startsWith("..") || relative(root, target).includes(":");
  return outside ? null : target;
}

async function validateMarkdownLinks(root, files) {
  const pattern = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g;
  for (const relativeFile of files.filter((file) => file.endsWith(".md"))) {
    const content = await readFile(join(root, relativeFile), "utf8");
    for (const [, reference] of content.matchAll(pattern)) {
      const target = localTarget(root, relativeFile, reference);
      if (!target) continue;
      try {
        await readFile(target);
      } catch {
        return `Documentation link does not resolve: ${reference} in ${relativeFile}.`;
      }
    }
  }
  return null;
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
    const linkError = await validateMarkdownLinks(root, await repositoryFiles(root));
    if (linkError) return fail(ruleId, linkError);
  } catch (error) {
    return fail(ruleId, `Documentation reference validation failed: ${error.message}`);
  }
  return pass(ruleId);
}
