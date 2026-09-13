import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.24/E-1.24.4.mjs";

test("rejects no publication or deployment commands in validation workflows", async () => {
  await expect(run({ root: process.cwd() })).resolves.toEqual({ ruleId: "E-1.24.4", status: "pass", message: "" });
});
