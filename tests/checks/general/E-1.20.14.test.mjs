import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.20.14.mjs";

test("passes when declared dependencies are referenced", async () => {
  await expect(
    run({
      root: "C:/repo",
      packageJson: { dependencies: { jest: "^30.0.0" } },
      referencedDependencies: new Set(["jest"]),
    }),
  ).resolves.toMatchObject({ status: "pass" });
});

test("fails when a declared dependency is unused", async () => {
  await expect(
    run({
      root: "C:/repo",
      packageJson: { dependencies: { jest: "^30.0.0", oxlint: "^1.0.0" } },
      referencedDependencies: new Set(["jest"]),
    }),
  ).resolves.toMatchObject({ status: "fail" });
});
