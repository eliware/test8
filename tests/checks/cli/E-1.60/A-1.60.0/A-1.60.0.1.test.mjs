import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/cli/E-1.60/A-1.60.0/A-1.60.0.1.mjs";

test("requires CLI behavior in AGENTS.md", async () => {
  await expect(run({ root: process.cwd() })).resolves.toEqual({ ruleId: "A-1.60.0.1", status: "pass", message: "" });
});
