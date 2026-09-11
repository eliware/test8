import { join } from "node:path";
import { fail, pass } from "../check-result.mjs";
import { collectFiles } from "./collect-files.mjs";
import { findLineLimitViolations } from "./find-line-limit-violations.mjs";

export const ruleId = "A-18.5.2";

export async function run({ root }) {
  const sourceFindings = await findLineLimitViolations(
    await collectFiles(join(root, "src"), ".mjs"),
    100,
    root,
  );
  const testFindings = await findLineLimitViolations(
    await collectFiles(join(root, "tests"), ".test.mjs"),
    200,
    root,
  );
  const findings = [...sourceFindings, ...testFindings];
  return findings.length === 0
    ? pass(ruleId)
    : fail(ruleId, `Line limits exceeded: ${findings.join(", ")}.`);
}
