import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { walkFiles } from "./walk-files.mjs";

const relativeReference = /(?:^|\s)(\.\.?\/[^\s`),;]+)/g;
const externalReference = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

function isReference(value) {
  return typeof value === "string" && value.startsWith(".") && !externalReference.test(value);
}

function collectReferences(value, references = []) {
  if (typeof value === "string") {
    for (const match of value.matchAll(relativeReference))
      references.push(match[1].replace(/[.!?]+$/, ""));
  } else if (Array.isArray(value)) {
    for (const item of value) collectReferences(item, references);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectReferences(item, references);
  }
  return references;
}

async function assertTarget(base, reference, location) {
  if (!isReference(reference) || !/\.[A-Za-z0-9*]+$/.test(reference)) return;
  const target = resolve(base, reference);
  if (reference.includes("*")) {
    const directory = target.slice(0, target.indexOf("*"));
    const files = await walkFiles(directory);
    if (!files.some((file) => file.startsWith(target.slice(0, target.indexOf("*")))))
      throw new Error(`${location}: unresolved reference ${reference}.`);
  } else {
    try {
      await readFile(target, "utf8");
    } catch {
      throw new Error(`${location}: unresolved reference ${reference}.`);
    }
  }
}

export async function findStructuredReferenceGaps(root, files) {
  const findings = [];
  for (const file of files) {
    let data;
    try {
      data = JSON.parse(await readFile(file, "utf8"));
    } catch (error) {
      findings.push(`${file}: invalid JSON (${error.message})`);
      continue;
    }
    const crosslinks = data?.crosslinks;
    if (crosslinks !== undefined) {
      if (!Array.isArray(crosslinks)) findings.push(`${file}: crosslinks must be an array.`);
      else {
        for (const [index, link] of crosslinks.entries()) {
          if (!link || typeof link.path !== "string" || !link.path.trim()) {
            findings.push(`${file}: crosslinks[${index}] requires a path.`);
            continue;
          }
          if (typeof link.authoritativeFor !== "string" || !link.authoritativeFor.trim())
            findings.push(`${file}: crosslinks[${index}] requires authoritativeFor.`);
          try {
            await assertTarget(dirname(file), link.path, `${file}: crosslinks[${index}]`);
          } catch (error) {
            findings.push(error.message);
          }
        }
      }
    }
    for (const reference of collectReferences(data)) {
      try {
        await assertTarget(dirname(file), reference, file);
      } catch (error) {
        findings.push(error.message);
      }
    }
  }
  return [...new Set(findings)];
}

export async function jsonFilesUnder(root) {
  return (await walkFiles(root)).filter(
    (file) =>
      file.endsWith(".json") &&
      !file.endsWith("package.json") &&
      !file.endsWith("package-lock.json"),
  );
}
