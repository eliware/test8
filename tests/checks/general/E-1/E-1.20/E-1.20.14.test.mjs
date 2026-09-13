import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.14.mjs";

test("reports direct dependencies without a source or tooling reference", async () => {
  await expect(run({ root: "C:\\repo", packageJson: { dependencies: { alpha: "1.0.0" } }, referencedDependencies: [] })).resolves.toEqual(expect.objectContaining({ status: "fail" }));
});

test("accepts referenced direct dependencies", async () => {
  await expect(run({ root: "C:\\repo", packageJson: { dependencies: { alpha: "1.0.0" } }, referencedDependencies: ["alpha"] })).resolves.toEqual({ ruleId: "E-1.20.14", status: "pass", message: "" });
});
