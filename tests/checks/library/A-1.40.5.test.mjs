import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/library/A-1.40.5.mjs";

test("requires public entrypoint and file allowlist", () => {
  expect(run({ packageJson: { main: "src/index.mjs", files: ["src"] } }).status).toBe("pass");
  expect(run({ packageJson: { main: "src/index.mjs" } }).status).toBe("fail");
  expect(run({ packageJson: { files: ["src"] } }).status).toBe("fail");
});
