export function findPublishMetadataGaps(packageJson) {
  if (packageJson?.private === true) return [];
  const findings = [];
  if (packageJson?.repository === undefined) findings.push("repository metadata");
  if (packageJson?.homepage === undefined) findings.push("homepage metadata");
  if (!packageJson?.publishConfig || typeof packageJson.publishConfig !== "object") {
    findings.push("publishConfig metadata");
  }
  for (const required of ["README.md", "LICENSE", "RELEASE_NOTES.md"]) {
    if (!Array.isArray(packageJson?.files) || !packageJson.files.includes(required)) {
      findings.push(`files: ${required}`);
    }
  }
  return findings;
}
