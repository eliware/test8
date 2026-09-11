import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.20.6.mjs";

test("requires Oxlint as a dependency", () => {
  expect(run({ packageJson: { dependencies: { oxlint: "^1.0.0" } } }).status).toBe("pass");
  expect(run({ packageJson: { dependencies: {} } }).status).toBe("fail");
});
