import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/cli/A-18.0.0.mjs";

test("requires the lint script to invoke eliware-test --lint", () => {
  expect(run({ packageJson: { scripts: { lint: "eliware-test --lint" } } }).status).toBe("pass");
  expect(run({ packageJson: { scripts: { lint: "oxlint" } } }).status).toBe("fail");
});
