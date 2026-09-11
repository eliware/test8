import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.10.0.mjs";

test("requires a package test script", () => {
  expect(run({ packageJson: { scripts: { test: "eliware-test" } } }).status).toBe("pass");
  expect(run({ packageJson: { scripts: {} } }).status).toBe("fail");
});
