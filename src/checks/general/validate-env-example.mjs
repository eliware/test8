import { readFile } from "node:fs/promises";

const assignment = /^\s*#?\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)$/;
const sensitiveValue = /(?:token|secret|password|private|credential|api[-_]?key)/i;

export async function findUnsafeEnvironmentExample(file) {
  const findings = [];
  const content = await readFile(file, "utf8");
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const match = assignment.exec(line);
    if (!match) continue;
    const value = match[2].trim();
    const commented = line.trimStart().startsWith("#");
    if (!commented && !value)
      findings.push(`${file}:${index + 1} ${match[1]} needs a placeholder value`);
    if (!commented && sensitiveValue.test(value)) {
      findings.push(`${file}:${index + 1} ${match[1]} contains a credential-like value`);
    }
  }
  return findings;
}
