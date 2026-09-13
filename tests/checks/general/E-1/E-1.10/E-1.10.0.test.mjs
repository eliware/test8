import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.10/E-1.10.0.mjs";

test("rejects publication and deployment commands from Knit validation", async () => {
  await expect(run({ root: process.cwd() })).resolves.toEqual({ ruleId: "E-1.10.0", status: "pass", message: "" });
});
