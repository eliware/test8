import { expect, jest, test } from "@jest/globals";

const runJest = jest.fn();
jest.unstable_mockModule("../../../../src/checks/general/E-1/E-1.20/run-jest.mjs", () => ({ runJest }));

const { run } = await import("../../../../src/checks/general/E-1/E-1.20.mjs");

test("skips Jest execution for orchestration-only seams", async () => {
  await expect(run({ executeJest: false })).resolves.toEqual({
    ruleId: "E-1.20",
    status: "pass",
    message: "",
  });
  expect(runJest).not.toHaveBeenCalled();
});

test("passes after a successful Jest run", async () => {
  runJest.mockResolvedValueOnce({ code: 0, stdout: "all tests passed", stderr: "" });

  await expect(run({ root: ".", executeJest: true, jestArgs: [] })).resolves.toEqual({
    ruleId: "E-1.20",
    status: "pass",
    message: "",
  });
  expect(runJest).toHaveBeenCalledWith(".", []);
});

test("preserves both Jest stdout and stderr on test failure", async () => {
  runJest.mockResolvedValueOnce({
    code: 1,
    stdout: "FAIL tests/example.test.mjs",
    stderr: "Expected: 1\nReceived: 2",
  });

  await expect(run({ root: ".", executeJest: true, jestArgs: [] })).resolves.toEqual({
    ruleId: "E-1.20",
    status: "fail",
    message: "Jest failed: FAIL tests/example.test.mjs\nExpected: 1\nReceived: 2",
  });
});

test("reports a launch failure", async () => {
  runJest.mockRejectedValueOnce(new Error("spawn failed"));

  await expect(run({ root: ".", executeJest: true, jestArgs: [] })).resolves.toEqual({
    ruleId: "E-1.20",
    status: "fail",
    message: "Jest could not be started: spawn failed",
  });
});
