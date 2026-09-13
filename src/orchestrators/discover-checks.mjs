import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const checksRoot = join(dirname(fileURLToPath(import.meta.url)), "../checks");
const rulePattern = /^([EA]-\d+(?:\.\d+)*)\.mjs$/;

function compareRuleIds(left, right) {
  const leftParts = left.split("-")[1].split(".").map(Number);
  const rightParts = right.split("-")[1].split(".").map(Number);
  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    const difference = (leftParts[index] ?? -1) - (rightParts[index] ?? -1);
    if (difference !== 0) return difference;
  }
  return left.localeCompare(right);
}

async function discoverTree(directory, importCheck, parentRuleId = null, readDirectory = readdir) {
  const entries = await readDirectory(directory, { withFileTypes: true });
  const modules = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      modules.push(
        ...(await discoverTree(
          join(directory, entry.name),
          importCheck,
          rulePattern.test(`${entry.name}.mjs`) ? entry.name : parentRuleId,
          readDirectory,
        )),
      );
      continue;
    }
    const match = rulePattern.exec(entry.name);
    if (!match) continue;
    const id = entry.name.slice(0, -4);
    const module = await importCheck(pathToFileURL(join(directory, entry.name)));
    if (module.ruleId !== id || typeof module.run !== "function") {
      throw new Error(`Invalid check module: ${entry.name}`);
    }
    modules.push({ ...module, parentRuleId });
  }
  return modules.sort((left, right) => compareRuleIds(left.ruleId, right.ruleId));
}

export async function discoverChecks(
  groups,
  { root = checksRoot, readDirectory = readdir, importCheck = (url) => import(url) } = {},
) {
  const discovered = [];
  const seen = new Set();
  for (const group of groups) {
    const groupRoot = join(root, group);
    try {
      await readDirectory(groupRoot, { withFileTypes: true });
    } catch {
      throw new Error(`Unknown convention group: ${group}`);
    }
    for (const module of await discoverTree(groupRoot, importCheck, null, readDirectory)) {
      if (seen.has(module.ruleId)) throw new Error(`Duplicate check module: ${module.ruleId}`);
      seen.add(module.ruleId);
      discovered.push(module);
    }
  }
  return discovered.sort((left, right) => compareRuleIds(left.ruleId, right.ruleId));
}

export async function discoverAllChecks(options = {}) {
  const root = options.root ?? checksRoot;
  const readDirectory = options.readDirectory ?? readdir;
  const groups = (await readDirectory(root, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();
  return discoverChecks(groups, { ...options, root, readDirectory });
}
