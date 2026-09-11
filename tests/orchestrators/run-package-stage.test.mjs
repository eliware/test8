import { expect, test } from "@jest/globals";
import { runPackageStage } from "../../src/orchestrators/run-package-stage.mjs";

test("runs selected package scripts in order", async () => {
  const order = [];
  const result = await runPackageStage(
    { scripts: { audit: "audit", build: "build" } },
    async (name) => {
      order.push(name);
      return { code: 0, stdout: name, stderr: "" };
    },
  );
  expect(order).toEqual(["audit", "build"]);
  expect(result.code).toBe(0);
});

test("runs every supported package stage in the stable order", async () => {
  const order = [];
  const result = await runPackageStage(
    { scripts: { audit: "audit", typecheck: "typecheck", build: "build", pack: "pack" } },
    async (name) => {
      order.push(name);
      return { code: 0, stdout: "", stderr: "" };
    },
  );
  expect(result.code).toBe(0);
  expect(order).toEqual(["audit", "pack", "build", "typecheck"]);
});

test("normalizes package-script failures to code 17", async () => {
  const result = await runPackageStage({ scripts: { audit: "audit" } }, async () => ({
    code: 2,
    stdout: "",
    stderr: "audit failed",
  }));
  expect(result).toEqual({ code: 17, category: "package", diagnostics: ["audit failed"] });
});

test("preserves stdout diagnostics from a failed package script", async () => {
  const result = await runPackageStage({ scripts: { build: "build" } }, async () => ({
    code: 1,
    stdout: "build failed",
    stderr: "",
  }));
  expect(result.diagnostics).toEqual(["build failed"]);
});

test("normalizes package-script execution errors to code 17", async () => {
  await expect(
    runPackageStage({ scripts: { audit: "audit" } }, async () => {
      throw new Error("runner unavailable");
    }),
  ).resolves.toEqual({
    code: 17,
    category: "package",
    diagnostics: ["runner unavailable"],
  });
});
