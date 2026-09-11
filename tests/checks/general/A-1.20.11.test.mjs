import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/A-1.20.11.mjs";

test("accepts absent or nonempty optional validation scripts", () => {
  expect(run({ packageJson: { scripts: {} } }).status).toBe("pass");
  expect(
    run({ packageJson: { scripts: { typecheck: "tsc --noEmit", build: "vite build" } } }).status,
  ).toBe("pass");
  expect(run({ packageJson: { scripts: { build: "" } } }).status).toBe("fail");
});
