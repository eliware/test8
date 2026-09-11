import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/A-1.0.8.mjs";

test("accepts a repository root", () => {
  expect(run({ root: "C:/repo" })).toEqual({ ruleId: "A-1.0.8", status: "pass", message: "" });
});

test("rejects a missing repository root", () => {
  expect(run({ root: "" })).toEqual({
    ruleId: "A-1.0.8",
    status: "fail",
    message: "Repository instructions require a root.",
  });
});
