import { buildPrettierArguments } from "../../src/checks/run-prettier.mjs";

test("builds read-only and write formatter arguments", () => {
  expect(buildPrettierArguments()).toEqual(["--check", "."]);
  expect(buildPrettierArguments({ write: true })).toEqual(["--write", "."]);
});
