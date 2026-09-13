import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.24/E-1.24.3.mjs";

test("requires repository/ref concurrency cancellation", async () => {
  await expect(run({ root: process.cwd() })).resolves.toEqual({ ruleId: "E-1.24.3", status: "pass", message: "" });
});
