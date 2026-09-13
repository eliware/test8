import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/general/E-1/E-1.4.mjs";

test("requires a nonempty lint script", async () => {
  await expect(run({ packageJson: { scripts: { lint: "eliware-test --lint" } } })).resolves.toMatchObject({ status: "pass" });
  await expect(run({ packageJson: { scripts: { lint: "" } } })).resolves.toMatchObject({ status: "fail" });
});

test("executes and reports the bundled lint result when requested", async () => {
  const packageJson = { scripts: { lint: "eliware-test --lint" } };
  await expect(run({ packageJson, root: "C:/repo", executeLint: true, runLint: async () => ({ code: 0 }) })).resolves.toMatchObject({ status: "pass" });
  await expect(run({ packageJson, root: "C:/repo", executeLint: true, runLint: async () => ({ code: 1, stdout: "warning" }) })).resolves.toMatchObject({ status: "fail" });
});
