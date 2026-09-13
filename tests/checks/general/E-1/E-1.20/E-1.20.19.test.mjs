import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.19.mjs";

test("requires the shared audit stage script", async () => {
  await expect(run({ packageJson: { scripts: { audit: "eliware-test --audit" } } })).resolves.toEqual({ ruleId: "E-1.20.19", status: "pass", message: "" });
  await expect(run({ packageJson: { scripts: { audit: "npm audit" } } })).resolves.toEqual(expect.objectContaining({ status: "fail" }));
});

test("reports audit diagnostics when the audit stage fails", async () => {
  await expect(run({
    packageJson: { scripts: { audit: "eliware-test --audit" } },
    root: "C:\\repo",
    executeAudit: true,
    mode: "audit",
    runAudit: async () => ({ code: 1, stdout: "audit findings", stderr: "" }),
  })).resolves.toEqual({
    ruleId: "E-1.20.19",
    status: "fail",
    message: "npm audit failed: audit findings",
  });
});
