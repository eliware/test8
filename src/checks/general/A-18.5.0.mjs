import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
import { collectFiles } from "./collect-files.mjs";
import { findBrokenMarkdownLinks } from "./find-broken-markdown-links.mjs";
import { findUnsafeEnvironmentExample } from "./validate-env-example.mjs";
import { findMissingSurfaceIndexes } from "./find-missing-surface-indexes.mjs";
import { findUndocumentedEnvironment } from "./find-undocumented-environment.mjs";

export const ruleId = "A-18.5.0";

const requiredPaths = [
  "README.md",
  "AGENTS.md",
  "RELEASE_NOTES.md",
  "docs",
  "specs",
  "examples",
  ".env.example",
];

export async function run({ root }) {
  const missing = [];
  for (const relativePath of requiredPaths) {
    try {
      await access(join(root, relativePath));
    } catch {
      missing.push(relativePath);
    }
  }
  missing.push(...(await findMissingSurfaceIndexes(root, ["docs", "specs", "examples"])));
  const markdownFiles = [];
  const envExample = join(root, ".env.example");
  for (const file of ["README.md", "AGENTS.md", "RELEASE_NOTES.md"]) {
    try {
      await access(join(root, file));
      markdownFiles.push(join(root, file));
    } catch {
      // The required-path result above reports missing root documents.
    }
  }
  for (const directory of ["docs", "specs", "examples"]) {
    markdownFiles.push(...(await collectFiles(join(root, directory), ".md")));
  }
  const brokenLinks = await findBrokenMarkdownLinks(markdownFiles);
  const unsafeEnvironment = missing.includes(".env.example")
    ? []
    : await findUnsafeEnvironmentExample(envExample);
  const sourceFiles = await collectFiles(join(root, "src"), ".mjs");
  const undocumentedEnvironment = missing.includes(".env.example")
    ? []
    : await findUndocumentedEnvironment(sourceFiles, envExample);
  const findings = [
    ...missing,
    ...brokenLinks.map((link) => `broken link ${link}`),
    ...unsafeEnvironment,
    ...undocumentedEnvironment.map((name) => `undocumented environment variable ${name}`),
  ];
  return findings.length === 0
    ? pass(ruleId)
    : fail(ruleId, `Repository surface requirements failed: ${findings.join(", ")}.`);
}
