function isHttpUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function findBasicPackageMetadataGaps(packageJson) {
  const findings = [];
  for (const field of ["author"]) {
    if (typeof packageJson?.[field] !== "string" || !packageJson[field].trim())
      findings.push(field);
  }
  if (
    !Array.isArray(packageJson?.keywords) ||
    packageJson.keywords.length === 0 ||
    packageJson.keywords.some((keyword) => typeof keyword !== "string" || !keyword.trim())
  ) {
    findings.push("keywords");
  }
  for (const field of ["repository", "bugs", "homepage"]) {
    const value =
      typeof packageJson?.[field] === "string" ? packageJson[field] : packageJson?.[field]?.url;
    if (value !== undefined && !isHttpUrl(value)) findings.push(`${field} URL`);
  }
  return findings;
}
