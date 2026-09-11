import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const checksRoot = join(dirname(fileURLToPath(import.meta.url)), "../checks");

function compareRuleFiles(left, right) {
  const leftMatch = /^([EA]-\d+(?:\.\d+)*)\.mjs$/.exec(left.name);
  const rightMatch = /^([EA]-\d+(?:\.\d+)*)\.mjs$/.exec(right.name);
  const leftParts = leftMatch[1].split("-")[1].split(".").map(Number);
  const rightParts = rightMatch[1].split("-")[1].split(".").map(Number);
  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    const difference = (leftParts[index] ?? -1) - (rightParts[index] ?? -1);
    if (difference !== 0) return difference;
  }
  return left.name.localeCompare(right.name);
}

function isRuleFile(entry) {
  return entry.isFile() && /^([EA]-\d+(?:\.\d+)*)\.mjs$/.test(entry.name);
}

export async function discoverChecks(
  groups,
  { root = checksRoot, readDirectory = readdir, importCheck = (url) => import(url) } = {},
) {
  const discovered = [];
  const seen = new Set();

  for (const group of groups) {
    const groupRoot = join(root, group);
    let entries;
    try {
      entries = await readDirectory(groupRoot, { withFileTypes: true });
    } catch {
      throw new Error(`Unknown convention group: ${group}`);
    }

    for (const entry of entries.filter(isRuleFile).sort(compareRuleFiles)) {
      const module = await importCheck(pathToFileURL(join(groupRoot, entry.name)));
      const id = entry.name.slice(0, -4);
      if (seen.has(id)) throw new Error(`Duplicate check module: ${id}`);
      if (module.ruleId !== id || typeof module.run !== "function") {
        throw new Error(`Invalid check module: ${group}/${entry.name}`);
      }
      seen.add(id);
      discovered.push(module);
    }
  }

  return discovered;
}
