import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.9/A-1.9.1.mjs";

test("requires a valid package baseline and selected documents", () => {
  expect(run({ packageJson: { version: "8.0.0", eliware: { apply: ["general"] } } }).status).toBe("pass");
  expect(run({ packageJson: { version: "latest", eliware: { apply: ["general"] } } }).status).toBe("fail");
});
