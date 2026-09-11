import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/A-1.9.1.mjs";

test("requires convention version metadata", () => {
  expect(run({ packageJson: { eliware: { conventions: { version: "8.0" } } } }).status).toBe(
    "pass",
  );
  expect(run({ packageJson: { eliware: { conventions: {} } } }).status).toBe("fail");
});
