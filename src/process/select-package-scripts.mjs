const supportedScripts = ["audit", "pack", "build", "typecheck"];

export function selectPackageScripts(packageJson) {
  const scripts = packageJson?.scripts ?? {};
  const selected = [];
  for (const name of supportedScripts) {
    if (scripts[name] === undefined) continue;
    if (typeof scripts[name] !== "string" || !scripts[name].trim()) {
      throw new Error(`Package script ${name} must be non-empty.`);
    }
    selected.push([name, scripts[name]]);
  }
  return selected;
}
