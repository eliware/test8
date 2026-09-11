import { expect, test } from "@jest/globals";
import { runTestStage } from "../../src/orchestrators/run-test-stage.mjs";

test("returns a passing test-stage result", async () => {
  const result = await runTestStage("C:/repo", [], async () => ({
    code: 0,
    stdout: "ok",
    stderr: "",
  }));
  expect(result).toEqual({ code: 0, category: "tests", output: "ok" });
});

test("normalizes test failures without hiding output", async () => {
  const result = await runTestStage("C:/repo", [], async () => ({
    code: 8,
    stdout: "failed",
    stderr: "details",
  }));
  expect(result).toEqual({ code: 8, category: "tests", output: "failed\ndetails" });
});

test("normalizes process startup failures", async () => {
  const result = await runTestStage("C:/repo", [], async () => {
    throw new Error("Jest unavailable");
  });
  expect(result).toEqual({ code: 14, category: "internal", output: "Jest unavailable" });
});

test("uses the internal failure code when the test process omits one", async () => {
  const result = await runTestStage("C:/repo", [], async () => ({
    stdout: "started",
    stderr: "",
  }));
  expect(result).toEqual({ code: 14, category: "tests", output: "started" });
});

test("allows a test process with no diagnostic output", async () => {
  const result = await runTestStage("C:/repo", [], async () => ({ code: 0 }));
  expect(result).toEqual({ code: 0, category: "tests", output: "" });
});
