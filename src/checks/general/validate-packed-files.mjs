import { resolveNpmLauncher } from "../../process/resolve-npm-launcher.mjs";
import { runChild } from "../../process/run-child.mjs";

const metadataFiles = new Set(["package.json"]);

export async function findPackedFileGaps(root, packageJson, execute = runChild) {
  const [command, script] = resolveNpmLauncher();
  const result = await execute(command, [script, "pack", "--dry-run", "--json"].filter(Boolean), {
    cwd: root,
  });
  if (result.code !== 0) return ["npm pack --dry-run failed"];
  let files;
  try {
    files = JSON.parse(result.stdout)[0]?.files?.map(({ path }) => path) ?? [];
  } catch {
    return ["npm pack --dry-run returned invalid JSON"];
  }
  const allowed = packageJson.files ?? [];
  const unexpected = files.filter(
    (file) =>
      !metadataFiles.has(file) &&
      !allowed.some((entry) => file === entry || file.startsWith(`${entry}/`)),
  );
  return unexpected.length > 0 ? [`unexpected packed files: ${unexpected.join(", ")}`] : [];
}
