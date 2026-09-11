import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.19.mjs";

test("requires core package metadata", () => {
  const packageJson = { name: "fixture", version: "8.0.0", description: "fixture", type: "module" };
  expect(run({ packageJson }).status).toBe("pass");
  expect(run({ packageJson: { ...packageJson, type: "commonjs" } }).status).toBe("fail");
});
