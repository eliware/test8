import { readFile } from "node:fs/promises";

const reference = /process\.env\.([A-Z][A-Z0-9_]*)/g;
const assignment = /^\s*#?\s*([A-Z][A-Z0-9_]*)\s*=/;

export async function findUndocumentedEnvironment(sourceFiles, envFile) {
  const referenced = new Set();
  for (const file of sourceFiles) {
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(reference)) referenced.add(match[1]);
  }
  const documented = new Set();
  const envContent = await readFile(envFile, "utf8");
  for (const line of envContent.split(/\r?\n/)) {
    const match = assignment.exec(line);
    if (match) documented.add(match[1]);
  }
  return [...referenced].filter((name) => !documented.has(name));
}
