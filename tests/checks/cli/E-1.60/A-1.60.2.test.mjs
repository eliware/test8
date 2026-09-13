import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/cli/E-1.60/A-1.60.2.mjs";

test("requires the documented CLI contract in README.md", async () => {
  await expect(run({ root: process.cwd() })).resolves.toEqual({ ruleId: "A-1.60.2", status: "pass", message: "" });
});
