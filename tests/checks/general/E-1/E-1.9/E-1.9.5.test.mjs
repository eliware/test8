import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.9/E-1.9.5.mjs";

test("requires crosslink authority records", () => {
  const packageJson = { eliware: { crosslinks: [{ path: "../docs", relation: "relatedAuthority", authoritativeFor: "docs" }] } };
  expect(run({ packageJson }).status).toBe("pass");
  expect(run({ packageJson: { eliware: { crosslinks: [{ path: "../docs" }] } } }).status).toBe("fail");
});
