import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../check-result.mjs";

export const ruleId = "E-1.8";
export const parentRuleId = "E-1";

const assignment = /^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/;

export async function run({ root, packageJson }) {
  const repositoryName = packageJson?.name?.replace(/^@[^/]+\//, "");
  if (!repositoryName) {
    return fail(ruleId, "package.json.name is required to derive the mailbox owner.");
  }

  const expected = `${repositoryName}@eliware.org`;
  let localEnvironment;
  try {
    localEnvironment = await readFile(join(root, ".env"), "utf8");
  } catch {
    return fail(ruleId, `Local .env must define the mailbox owner as ${expected}.`);
  }

  const owner = localEnvironment
    .split(/\r?\n/)
    .map((line) => assignment.exec(line))
    .find((match) => match && /(?:MAILBOX|OWNER|EMAIL)/i.test(match[1]));
  if (!owner || owner[2] !== expected) {
    return fail(ruleId, `Local .env must define the mailbox owner as ${expected}.`);
  }

  let example = "";
  try {
    example = await readFile(join(root, ".env.example"), "utf8");
  } catch {
    return pass(ruleId);
  }
  if (example.includes(expected)) {
    return fail(ruleId, ".env.example must not contain the repository mailbox owner address.");
  }
  return pass(ruleId);
}
