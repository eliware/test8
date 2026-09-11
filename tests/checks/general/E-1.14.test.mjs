import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.14.mjs";

test("requires a validation lifecycle", () => {
  expect(run({ packageJson: { scripts: { test: "eliware-test" } } }).status).toBe("pass");
  expect(run({ packageJson: { scripts: {} } }).status).toBe("fail");
});
