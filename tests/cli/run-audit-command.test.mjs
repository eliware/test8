import { runAuditCommand } from "../../src/cli/run-audit-command.mjs";

test("runs the shared audit process and reports its output", async () => {
  const output = [];
  const execute = async (root) => ({
    root,
    code: 7,
    stdout: "audit stdout",
    stderr: "audit stderr",
  });
  await expect(runAuditCommand("C:/repo", (value) => output.push(value), execute)).resolves.toBe(7);
  expect(output).toEqual(["audit stdout\naudit stderr"]);
});
