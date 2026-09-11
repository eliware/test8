import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/A-1.0.9.mjs";
test("requires package identity", () => {
  expect(run({ packageJson: { name: "fixture" } }).status).toBe("pass");
  expect(run({ packageJson: {} }).status).toBe("fail");
});
