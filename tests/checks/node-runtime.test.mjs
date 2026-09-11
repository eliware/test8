import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/E-1.20.1.mjs";

test("passes when engines.node requires Node 26 or newer", () => {
  expect(run({ packageJson: { engines: { node: ">=26" } } })).toEqual({
    ruleId: "E-1.20.1",
    status: "pass",
    message: "",
  });
});

test("fails when the declared Node runtime is absent or below 26", () => {
  const result = run({ packageJson: { engines: { node: ">=20" } } });
  expect(result.status).toBe("fail");
  expect(result.message).toMatch(/Node 26/);
});

test("fails when engines metadata is absent", () => {
  expect(run({ packageJson: {} }).status).toBe("fail");
});
