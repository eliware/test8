import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/discord/E-1.70.mjs";

test("requires application conventions", () => {
  expect(
    run({
      packageJson: { eliware: { conventions: { apply: ["general", "discord", "application"] } } },
    }).status,
  ).toBe("pass");
  expect(
    run({ packageJson: { eliware: { conventions: { apply: ["general", "discord"] } } } }).status,
  ).toBe("fail");
});
