import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/A-1.0.10.mjs";
test("requires v8 convention metadata", () => {
  expect(run({ packageJson: { eliware: { conventions: { version: "8.0" } } } }).status).toBe(
    "pass",
  );
  expect(run({ packageJson: { eliware: { conventions: { version: "7.0" } } } }).status).toBe(
    "fail",
  );
});
