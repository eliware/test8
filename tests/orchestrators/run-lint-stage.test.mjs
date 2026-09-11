import { expect, test } from "@jest/globals";
import { runLintStage } from "../../src/orchestrators/run-lint-stage.mjs";

test("returns a passing lint-stage result", async () => {
  const result = await runLintStage("C:/repo", async () => ({
    code: 0,
    stdout: "clean",
    stderr: "",
  }));
  expect(result).toEqual({ code: 0, category: "lint", output: "clean" });
});

test("returns a lint failure and preserves diagnostics", async () => {
  const result = await runLintStage("C:/repo", async () => ({
    code: 1,
    stdout: "",
    stderr: "warning",
  }));
  expect(result).toEqual({ code: 12, category: "lint", output: "warning" });
});

test("returns an internal failure when lint cannot start", async () => {
  const result = await runLintStage("C:/repo", async () => {
    throw new Error("Oxlint unavailable");
  });
  expect(result).toEqual({ code: 14, category: "internal", output: "Oxlint unavailable" });
});
