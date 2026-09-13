import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.10/E-1.10.1.mjs";

test("requires the exact Knit command sequence", async () => {
  await expect(run({ root: process.cwd() })).resolves.toEqual({ ruleId: "E-1.10.1", status: "pass", message: "" });
});
