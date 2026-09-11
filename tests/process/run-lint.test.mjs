import { expect, test } from "@jest/globals";
import { buildLintArguments } from "../../src/process/run-lint.mjs";

test("builds Oxlint arguments with warnings denied", () => {
  expect(buildLintArguments()).toEqual(["--deny", "warnings", "."]);
});
