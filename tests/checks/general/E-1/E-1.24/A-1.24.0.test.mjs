import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.24/A-1.24.0.mjs";

test("requires npm ci before npm test", async () => {
  const root = process.cwd();
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.24.0", status: "pass", message: "" });
});
