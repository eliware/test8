import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/A-1.0.7.mjs";
test("requires Eliware convention metadata", () => {
  expect(run({ packageJson: { eliware: { conventions: {} } } }).status).toBe("pass");
  expect(run({ packageJson: {} }).status).toBe("fail");
});
