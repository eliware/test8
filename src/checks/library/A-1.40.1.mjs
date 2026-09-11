import { access, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
export const ruleId = "A-1.40.1";
export async function run({ root, packageJson }) {
  try {
    await access(join(root, "examples", "README.md"));
  } catch {
    return fail(ruleId, "Libraries require examples/README.md.");
  }
  try {
    const entries = await readdir(join(root, "examples"), { withFileTypes: true });
    if (!entries.some((entry) => entry.isFile() && entry.name !== "README.md"))
      return fail(ruleId, "Libraries require a runnable example under examples/.");
  } catch {
    return fail(ruleId, "Libraries require an examples directory.");
  }
  if (packageJson?.name && !packageJson.name.startsWith("@eliware/"))
    return fail(ruleId, "Public Eliware libraries must use the @eliware scope.");
  return pass(ruleId);
}
