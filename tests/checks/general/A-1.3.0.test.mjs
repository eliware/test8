import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/A-1.3.0.mjs";

test("requires the aggregate test command to invoke eliware-test", () => {
  expect(run({ packageJson: { scripts: { test: "eliware-test" } } }).status).toBe("pass");
  expect(run({ packageJson: { scripts: { test: "jest" } } }).status).toBe("fail");
});
