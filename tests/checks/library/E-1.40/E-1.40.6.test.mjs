import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/library/E-1.40/E-1.40.6.mjs";

test("requires typecheck", () => {
  expect(run({ packageJson: { scripts: { typecheck: "tsc" } } }).status).toBe("pass");
  expect(run({ packageJson: { scripts: {} } }).status).toBe("fail");
});
