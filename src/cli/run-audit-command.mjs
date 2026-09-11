import { runAudit } from "../process/run-audit.mjs";

export async function runAuditCommand(root, write, execute = runAudit) {
  const result = await execute(root);
  const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
  if (output) write(output);
  return result.code;
}
