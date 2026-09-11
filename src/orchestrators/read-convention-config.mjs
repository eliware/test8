export function readConventionConfig(packageJson) {
  const conventions = packageJson?.eliware?.conventions;
  if (!conventions || !Array.isArray(conventions.apply)) {
    throw new Error("package.json must define eliware.conventions.apply.");
  }
  if (conventions.version !== "8.0") {
    throw new Error("eliware.conventions.version must be 8.0.");
  }
  return conventions;
}
