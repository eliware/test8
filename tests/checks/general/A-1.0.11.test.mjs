import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/A-1.0.11.mjs";
test("requires a package file surface", () => {
  expect(run({ packageJson: { files: ["src"] } }).status).toBe("pass");
  expect(run({ packageJson: {} }).status).toBe("fail");
});
