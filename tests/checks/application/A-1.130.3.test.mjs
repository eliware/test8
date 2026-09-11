import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/application/A-1.130.3.mjs";

test("requires a runtime or CLI entrypoint", () => {
  expect(run({ packageJson: { scripts: { start: "node src/index.mjs" } } }).status).toBe("pass");
  expect(run({ packageJson: { bin: { app: "bin/app.mjs" } } }).status).toBe("pass");
  expect(run({ packageJson: { scripts: {} } }).status).toBe("fail");
});
