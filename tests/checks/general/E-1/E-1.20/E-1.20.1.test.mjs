import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.1.mjs";

test("requires the current Node.js major", () => {
  const result = run({});
  expect(result.ruleId).toBe("E-1.20.1");
  expect(result.status).toBe(process.versions.node.startsWith("26.") ? "pass" : "fail");
});
