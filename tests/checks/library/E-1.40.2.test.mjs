import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/library/E-1.40.2.mjs";

test("requires a nonempty pack script", () => {
  expect(run({ packageJson: { scripts: { pack: "npm pack --dry-run" } } }).status).toBe("pass");
  expect(run({ packageJson: { scripts: {} } }).status).toBe("fail");
});
