import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/A-1.9.6.mjs";

test("requires documented crosslink relations", () => {
  expect(
    run({ packageJson: { eliware: { crosslinks: [{ relation: "relatedAuthority" }] } } }).status,
  ).toBe("pass");
  expect(run({ packageJson: { eliware: { crosslinks: [{ relation: "unknown" }] } } }).status).toBe(
    "fail",
  );
});
