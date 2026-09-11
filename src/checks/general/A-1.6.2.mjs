import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.6.2";

const execFileAsync = promisify(execFile);
const secretLike = /(^|[\\/])\.env(?:$|\.)|(?:secret|token|credential|password)|\.(?:pem|key)$/i;

export async function run({ root }) {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["ls-files", "--cached", "--others", "--exclude-standard"],
      {
        cwd: root,
        maxBuffer: 1_000_000,
      },
    );
    const findings = stdout
      .split(/\r?\n/)
      .filter(Boolean)
      .filter((file) => !/\.env\.example$/i.test(file))
      .filter((file) => secretLike.test(file));
    return findings.length === 0
      ? pass(ruleId)
      : fail(
          ruleId,
          `Secret-like repository paths require exact approved exemptions: ${findings.join(", ")}.`,
        );
  } catch (error) {
    return fail(ruleId, `Unable to inspect version-controlled paths: ${error.message}`);
  }
}
