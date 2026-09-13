import { fail, pass } from "../../check-result.mjs";
import { runJest } from "./E-1.20/run-jest.mjs";

export const ruleId = "E-1.20";
export const parentRuleId = "E-1";

export async function run(context) {
  if (!context.executeJest) return pass(ruleId);
  const startedAt = Date.now();
  try {
    context.jestResult = { ...(await runJest(context.root, context.jestArgs ?? [])), startedAt };
  } catch (error) {
    return fail(ruleId, `Jest could not be started: ${error.message}`);
  }
  if (context.jestResult.code !== 0) {
    const detail = [context.jestResult.stdout, context.jestResult.stderr].filter(Boolean).join("\n").trim();
    return fail(ruleId, detail ? `Jest failed: ${detail}` : "Jest failed without diagnostics.");
  }
  return pass(ruleId);
}
