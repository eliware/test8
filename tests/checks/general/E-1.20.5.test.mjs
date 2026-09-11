import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.20.5.mjs";

test("requires Jest when the harness uses it", () => {
  expect(run({ packageJson: { dependencies: { jest: "^30.0.0" } } }).status).toBe("pass");
  expect(run({ packageJson: { dependencies: {} } }).status).toBe("fail");
});
