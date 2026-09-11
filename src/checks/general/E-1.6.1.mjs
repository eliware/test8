import { fail, pass } from "../check-result.mjs";
import { walkFiles } from "./walk-files.mjs";

export const ruleId = "E-1.6.1";

const prohibitedName =
  /(?:^|[._-])(backup|backups|dump|dumps|restore|restores|runtime[-_ ]?state)(?:$|[._-])/i;
const prohibitedExtension = /\.(?:bak|dump|dmp|sql\.gz|tar\.gz|zip)$/i;

export async function run({ root }) {
  try {
    const files = await walkFiles(root);
    const findings = files.filter((file) => {
      const name = file.slice(root.length + 1);
      return prohibitedName.test(name) || prohibitedExtension.test(name);
    });
    return findings.length === 0
      ? pass(ruleId)
      : fail(
          ruleId,
          `Repository contains prohibited backup or runtime-state files: ${findings.join(", ")}.`,
        );
  } catch (error) {
    return fail(ruleId, error.message);
  }
}
