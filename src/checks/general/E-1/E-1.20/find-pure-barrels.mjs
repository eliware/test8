import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const excluded = new Set([".git", "coverage", "dist", "build", "node_modules"]);

export function isPureBarrelSource(source) {
  const withoutComments = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|\s)\/\/.*(?=\r?$)/gm, "$1")
    .trim();
  if (!withoutComments) return false;
  return withoutComments
    .split(/;|(?=\b(?:import|export)\s)|\n(?=\s*(?:const|let|var|function|class)\b)/u)
    .map((statement) => statement.trim())
    .filter(Boolean)
    .every((statement) => /^(?:import\b|export\s+(?:(?:type\s+)?(?:\{|\*)))[\s\S]*$/u.test(statement));
}

async function sourceFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!excluded.has(entry.name)) files.push(...(await sourceFiles(join(directory, entry.name))));
    } else if (entry.isFile() && entry.name.endsWith(".mjs")) {
      files.push(join(directory, entry.name));
    }
  }
  return files;
}

export async function findPureBarrels(root) {
  let files;
  try {
    files = await sourceFiles(join(root, "src"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const barrels = [];
  for (const file of files) {
    if (isPureBarrelSource(await readFile(file, "utf8"))) {
      barrels.push(relative(root, file).replaceAll("\\", "/"));
    }
  }
  return barrels;
}
