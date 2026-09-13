import { fail, pass } from "../../../check-result.mjs";
import { runPrettier } from "../../../run-prettier.mjs";

export const ruleId = "E-1.20.17";
export const parentRuleId = "E-1.20";

const requiredScripts = {
  test: "eliware-test",
  lint: "eliware-test --lint",
  audit: "eliware-test --audit",
  format: "eliware-test --format",
  "format:check": "eliware-test --format-check",
};

export async function run({ packageJson, root, executeFormat = false, mode = null, runFormatter = runPrettier }) {
  const scripts = packageJson?.scripts;
  for (const [name, command] of Object.entries(requiredScripts)) {
    if (scripts?.[name] !== command) return fail(ruleId, `package.json.scripts.${name} must be exactly ${command}.`);
  }
  if (!executeFormat || (mode !== null && mode !== "format" && mode !== "format-check")) return pass(ruleId);
  try {
    const result = await runFormatter(root, { write: mode === "format" });
    if (result.code !== 0) {
      const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
      return fail(ruleId, detail ? `Prettier failed: ${detail}` : "Prettier failed without diagnostics.");
    }
    return pass(ruleId);
  } catch (error) {
    return fail(ruleId, `Prettier could not be started: ${error.message}`);
  }
}
