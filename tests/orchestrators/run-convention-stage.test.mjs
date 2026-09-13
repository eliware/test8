import { expect, test } from "@jest/globals";
import { runConventionStage } from "../../src/orchestrators/run-convention-stage.mjs";
import { readConventionConfig } from "../../src/orchestrators/read-convention-config.mjs";

test("returns a passing convention stage", async () => {
  const result = await runConventionStage(async () => [
    { ruleId: "E-1.0", status: "pass", message: "" },
  ]);
  expect(result).toEqual({ code: 0, category: "conventions", diagnostics: [] });
});

test("returns convention failure diagnostics for failed checks", async () => {
  const result = await runConventionStage(async () => [
    { ruleId: "E-1.0", status: "fail", message: "missing file" },
  ]);
  expect(result).toEqual({
    code: 18,
    category: "conventions",
    diagnostics: ["E-1.0: missing file"],
  });
});

test("preserves stable failure codes for each validation stage", async () => {
  await expect(runConventionStage(async () => [{ ruleId: "E-1.20", status: "fail", message: "Jest failed" }])).resolves.toEqual({ code: 8, category: "conventions", diagnostics: ["E-1.20: Jest failed"] });
  await expect(runConventionStage(async () => [{ ruleId: "E-1.20.10", status: "fail", message: "coverage gap" }])).resolves.toEqual({ code: 10, category: "conventions", diagnostics: ["E-1.20.10: coverage gap"] });
  await expect(runConventionStage(async () => [{ ruleId: "E-1.4", status: "fail", message: "Oxlint failed" }])).resolves.toEqual({ code: 12, category: "conventions", diagnostics: ["E-1.4: Oxlint failed"] });
  await expect(runConventionStage(async () => [{ ruleId: "E-1.140.1", status: "fail", message: "pack failed" }])).resolves.toEqual({ code: 17, category: "conventions", diagnostics: ["E-1.140.1: pack failed"] });
});

test("normalizes convention-runner errors as convention failures", async () => {
  const result = await runConventionStage(async () => {
    throw new Error("invalid config");
  });
  expect(result).toEqual({ code: 18, category: "conventions", diagnostics: ["invalid config"] });
});

test("reads valid convention configuration", () => {
  const apply = ["general"];
  expect(readConventionConfig({ eliware: { apply } })).toEqual({ apply });
});

test("rejects convention configuration without apply groups", () => {
  expect(() => readConventionConfig({})).toThrow(/must define eliware\.apply/);
});

test("rejects an empty apply list", () => {
  expect(() => readConventionConfig({ eliware: { apply: [] } })).toThrow(/apply/);
});
