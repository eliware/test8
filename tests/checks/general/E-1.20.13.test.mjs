import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.20.13.mjs";

test("accepts nonempty dependency ranges", () => {
  expect(run({ packageJson: { dependencies: { jest: "^30.0.0" } } }).status).toBe("pass");
});

test("rejects empty or non-string dependency ranges", () => {
  expect(run({ packageJson: { dependencies: { jest: "" } } }).status).toBe("fail");
  expect(run({ packageJson: { optionalDependencies: { oxlint: null } } }).status).toBe("fail");
});
