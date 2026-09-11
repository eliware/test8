import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
import { findPublishMetadataGaps } from "./validate-publish-metadata.mjs";
import { findBasicPackageMetadataGaps } from "./validate-basic-package-metadata.mjs";
import { findPackedFileGaps } from "./validate-packed-files.mjs";

export const ruleId = "A-18.6.1";
const publishedSurfaces = ["bin", "src", "specs", "docs", "examples"];

export async function run(
  { root, packageJson, executePackage },
  { findPackedFiles = findPackedFileGaps, readLockfile = readRepositoryLockfile } = {},
) {
  const missing = [];
  missing.push(...(await findPackedFiles(root, packageJson, executePackage)));
  missing.push(...findBasicPackageMetadataGaps(packageJson));
  missing.push(...findPublishMetadataGaps(packageJson));
  if (packageJson?.license !== "MIT") missing.push("license: MIT");
  if (packageJson?.type !== "module") missing.push("type: module");
  if (packageJson?.engines?.node !== ">=26") missing.push("engines.node: >=26");
  if (packageJson?.bin?.["eliware-test"] !== "./bin/eliware-test.mjs") {
    missing.push("bin.eliware-test");
  }
  for (const surface of publishedSurfaces) {
    if (!Array.isArray(packageJson?.files) || !packageJson.files.includes(surface)) {
      missing.push(`files: ${surface}`);
    }
  }
  for (const dependency of ["jest", "oxlint", "prettier"]) {
    if (!packageJson?.dependencies?.[dependency] && !packageJson?.devDependencies?.[dependency]) {
      missing.push(`dependency: ${dependency}`);
    }
  }
  try {
    const lockfile = await readLockfile(root);
    if (lockfile.name !== packageJson.name) missing.push("package-lock.json.name");
    if (lockfile.version !== packageJson.version) missing.push("package-lock.json.version");
  } catch {
    missing.push("package-lock.json");
  }
  return missing.length === 0
    ? pass(ruleId)
    : fail(
        ruleId,
        `Required package release metadata is missing or invalid: ${missing.join(", ")}.`,
      );
}

async function readRepositoryLockfile(root) {
  await access(join(root, "package-lock.json"));
  return JSON.parse(await readFile(join(root, "package-lock.json"), "utf8"));
}
