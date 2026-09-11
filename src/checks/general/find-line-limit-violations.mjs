import { readFile } from "node:fs/promises";

export async function findLineLimitViolations(files, limit, root) {
  const findings = [];
  for (const file of files) {
    const lines = (await readFile(file, "utf8"))
      .split(/\r?\n/)
      .filter((line, index, all) => index < all.length - 1 || line).length;
    if (lines > limit) findings.push(`${file.slice(root.length + 1)} (${lines} > ${limit})`);
  }
  return findings;
}
