import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/general/E-1/E-1.4.mjs";

test("requires a nonempty lint script", () => {
  expect(run({ packageJson: { scripts: { lint: "eliware-test --lint" } } }).status).toBe("pass");
  expect(run({ packageJson: { scripts: { lint: "" } } }).status).toBe("fail");
});
