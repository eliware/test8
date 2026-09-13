import { expect, test } from "@jest/globals";
import { discoverChecks } from "../../src/orchestrators/discover-checks.mjs";

test("discovers the bundled general convention checks", async () => {
  const checks = await discoverChecks(["general"]);
  expect(checks.length).toBeGreaterThan(0);
  expect(checks.every(({ ruleId }) => /^([EA])-\d+(?:\.\d+)*$/.test(ruleId))).toBe(true);
  expect(checks.every(({ run }) => typeof run === "function")).toBe(true);
});

test("bundled check modules return pass results while scaffolded", async () => {
  const [check] = await discoverChecks(["general"]);
  expect(check.run({ root: process.cwd() })).toMatchObject({
    ruleId: check.ruleId,
    status: "pass",
  });
});
