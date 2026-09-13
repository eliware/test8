import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/web/E-1.50/E-1.50.4.mjs";

test("requires a build script", () => {
  expect(run({ packageJson: { scripts: { build: "webpack" } } }).status).toBe("pass");
  expect(run({ packageJson: { scripts: {} } }).status).toBe("fail");
});
