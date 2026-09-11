import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/application/E-1.130.mjs";

test("requires the application group", () => {
  expect(
    run({ packageJson: { eliware: { conventions: { apply: ["general", "application"] } } } })
      .status,
  ).toBe("pass");
  expect(run({ packageJson: { eliware: { conventions: { apply: ["general"] } } } }).status).toBe(
    "fail",
  );
});
