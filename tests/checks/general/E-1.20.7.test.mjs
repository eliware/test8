import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.20.7.mjs";

test("requires an object Jest configuration", () => {
  expect(run({ packageJson: { jest: { testEnvironment: "node" } } }).status).toBe("pass");
  expect(run({ packageJson: {} }).status).toBe("fail");
  expect(run({ packageJson: { jest: [] } }).status).toBe("fail");
});
