import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
import { walkFiles } from "./walk-files.mjs";
import { findUndocumentedEnvironment } from "./find-undocumented-environment.mjs";
import { findUnsafeEnvironmentExample } from "./validate-env-example.mjs";

export const ruleId = "E-1.20.8";

const environmentReference = /process\.env\.([A-Z][A-Z0-9_]*)/g;

export async function run({ root }) {
  try {
    await readFile(join(root, "package.json"), "utf8");
  } catch {
    return fail(ruleId, "package.json is required to determine environment configuration.");
  }
  const sourceFiles = (await walkFiles(root)).filter((file) =>
    /\.(?:mjs|js|cjs|ts|tsx)$/.test(file),
  );
  const sourceText = await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")));
  if (!sourceText.some((text) => text.includes("process.env"))) return pass(ruleId);
  const envFile = join(root, ".env.example");
  try {
    await access(envFile);
    const missing = await findUndocumentedEnvironment(sourceFiles, envFile);
    const unsafe = await findUnsafeEnvironmentExample(envFile);
    return missing.length === 0 && unsafe.length === 0
      ? pass(ruleId)
      : fail(
          ruleId,
          [...missing.map((name) => `undocumented variable ${name}`), ...unsafe].join("; "),
        );
  } catch {
    return fail(
      ruleId,
      "Node.js repositories using environment configuration must include .env.example.",
    );
  }
}

export { environmentReference };
