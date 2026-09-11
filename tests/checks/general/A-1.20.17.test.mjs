import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/A-1.20.17.mjs";

test("requires the standard package scripts", () => {
  const scripts = {
    test: "eliware-test",
    lint: "eliware-test --lint",
    format: "prettier",
    "format:check": "prettier --check",
  };
  expect(run({ packageJson: { scripts } }).status).toBe("pass");
  expect(run({ packageJson: { scripts: { ...scripts, lint: "" } } }).status).toBe("fail");
});
