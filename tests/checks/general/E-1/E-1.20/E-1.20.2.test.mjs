import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.2.mjs";

test("requires native ESM", () => {
  expect(run({ packageJson: { type: "module" } })).toEqual({ ruleId: "E-1.20.2", status: "pass", message: "" });
  expect(run({ packageJson: { type: "commonjs" } })).toEqual(expect.objectContaining({ status: "fail" }));
});
