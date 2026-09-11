import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/infrastructure/A-1.90.0.5.mjs";

test("requires an explicit authority record", () => {
  expect(
    run({ packageJson: { eliware: { authority: { path: "docs/authority-map.json" } } } }).status,
  ).toBe("pass");
  expect(run({ packageJson: { eliware: {} } }).status).toBe("fail");
});
