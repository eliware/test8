import { readdir } from "node:fs/promises";
import { join } from "node:path";

const MAX_DEPTH = 100;
const MAX_FILES = 10_000;
const EXCLUDED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "coverage",
  "dist",
  "build",
  "test-results",
  ".nyc_output",
]);

export async function walkFiles(
  root,
  { maxDepth = MAX_DEPTH, maxFiles = MAX_FILES, readDirectory = readdir } = {},
) {
  const files = [];
  async function visit(directory, depth) {
    if (depth > maxDepth) throw new Error(`File discovery exceeded depth limit (${maxDepth}).`);
    let entries;
    try {
      entries = await readDirectory(directory, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    for (const entry of entries) {
      if (entry.isDirectory() && EXCLUDED_DIRECTORIES.has(entry.name)) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path, depth + 1);
      else if (entry.isFile()) {
        files.push(path);
        if (files.length > maxFiles)
          throw new Error(`File discovery exceeded file limit (${maxFiles}).`);
      }
    }
  }
  await visit(root, 0);
  return files;
}
