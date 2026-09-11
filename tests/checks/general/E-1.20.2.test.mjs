import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.20.2.mjs";

test("requires native ESM", () => {
  expect(run({ packageJson: { type: "module" } }).status).toBe("pass");
  expect(run({ packageJson: { type: "commonjs" } }).status).toBe("fail");
});
