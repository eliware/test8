import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/web/E-1.50.mjs";

test("requires the web group", () => {
  expect(
    run({ packageJson: { eliware: { conventions: { apply: ["general", "web"] } } } }).status,
  ).toBe("pass");
  expect(
    run({ packageJson: { eliware: { conventions: { apply: ["general", "application"] } } } })
      .status,
  ).toBe("fail");
});
