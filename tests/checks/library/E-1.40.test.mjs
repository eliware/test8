import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/library/E-1.40.mjs";

test("requires the library group and does not require the removed node group", () => {
  expect(
    run({ packageJson: { eliware: { conventions: { apply: ["general", "library"] } } } }).status,
  ).toBe("pass");
  expect(
    run({ packageJson: { eliware: { conventions: { apply: ["general", "node"] } } } }).status,
  ).toBe("fail");
});
