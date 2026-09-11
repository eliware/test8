import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/library/E-1.40.4.mjs";

test("requires pack validation", () => {
  expect(run({ packageJson: { scripts: { pack: "npm pack --dry-run" } } }).status).toBe("pass");
  expect(run({ packageJson: { scripts: { pack: "echo package" } } }).status).toBe("fail");
});
