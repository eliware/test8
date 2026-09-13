import { expect, test } from "@jest/globals";
import { discoverChecks } from "../../src/orchestrators/discover-checks.mjs";

test("discovers and sorts checks from an explicit profile", async () => {
  const checks = await discoverChecks(["application"]);
  expect(checks.length).toBeGreaterThan(0);
  expect(checks[0].ruleId).toBe("E-1.130");
  expect(checks.every((check) => typeof check.run === "function")).toBe(true);
});

test("rejects an unknown profile", async () => {
  await expect(discoverChecks(["not-a-profile"])).rejects.toThrow("Unknown convention group");
});
