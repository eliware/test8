import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../check-result.mjs";

export const ruleId = "A-1.110.3";
export const parentRuleId = "E-1.110";

export async function run({ root }) {
  try {
    const readme = await readFile(join(root, "README.md"), "utf8");
    await access(join(root, "runbooks", "README.md"));
    if (!readme.includes("runbooks/README.md")) return fail(ruleId, "Workspace README.md must link runbooks/README.md.");
    for (const file of ["specs/directives.json", "specs/authority.json"]) {
      try {
        await access(join(root, file));
        if (!readme.includes(file)) return fail(ruleId, `Workspace README.md must link ${file}.`);
      } catch {
        // The structured record is optional when the repository does not define it.
      }
    }
  } catch {
    return fail(ruleId, "Workspace README.md and runbooks/README.md are required.");
  }
  return pass(ruleId);
}
