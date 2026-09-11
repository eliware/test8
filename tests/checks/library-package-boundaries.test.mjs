import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/library/A-1.40.5.mjs";

test.each([
  { exports: { ".": "./index.mjs" }, files: ["src", "README.md"] },
  { main: "./index.mjs", files: ["dist", "README.md"] },
])("accepts a public entrypoint and package allowlist: %j", (packageJson) => {
  expect(run({ packageJson })).toEqual({ ruleId: "A-1.40.5", status: "pass", message: "" });
});

test.each([{}, { files: ["src"] }, { exports: "./index.mjs" }, undefined])(
  "rejects missing public entrypoint or package allowlist: %j",
  (packageJson) => {
    expect(run({ packageJson })).toMatchObject({
      ruleId: "A-1.40.5",
      status: "fail",
    });
  },
);

test("rejects an empty package file allowlist", () => {
  expect(run({ packageJson: { exports: "./index.mjs", files: [] } })).toEqual({
    ruleId: "A-1.40.5",
    status: "fail",
    message: "Libraries must declare an intentional package file allowlist.",
  });
});
