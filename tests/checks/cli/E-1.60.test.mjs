import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/cli/E-1.60.mjs";

test("requires the cli group", () => {
  expect(
    run({ packageJson: { eliware: { conventions: { apply: ["general", "cli"] } } } }).status,
  ).toBe("pass");
  expect(
    run({ packageJson: { eliware: { conventions: { apply: ["general", "application"] } } } })
      .status,
  ).toBe("fail");
});
