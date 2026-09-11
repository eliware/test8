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

test("normalizes convention-runner errors as convention failures", async () => {
  const result = await runConventionStage(async () => {
    throw new Error("invalid config");
  });
  expect(result).toEqual({ code: 18, category: "conventions", diagnostics: ["invalid config"] });
});

test("reads valid convention configuration", () => {
  const conventions = { version: "8.0", apply: ["general"] };
  expect(readConventionConfig({ eliware: { conventions } })).toBe(conventions);
});

test("rejects convention configuration without apply groups", () => {
  expect(() => readConventionConfig({})).toThrow(/must define eliware\.conventions\.apply/);
});

test("rejects unsupported convention versions", () => {
  expect(() =>
    readConventionConfig({ eliware: { conventions: { version: "7.0", apply: [] } } }),
  ).toThrow(/version must be 8\.0/);
});
