import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.10.mjs";

async function fixture(total) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-e-1-20-10-"));
  await mkdir(join(root, "coverage"));
  await writeFile(join(root, "coverage", "coverage-summary.json"), JSON.stringify({ total }));
  return root;
}

const complete = Object.fromEntries(
  ["statements", "branches", "functions", "lines"].map((metric) => [metric, { pct: 100 }]),
);

test("passes when Jest reports 100% for all four coverage metrics", async () => {
  const root = await fixture(complete);
  await expect(run({ root, executeJest: true, jestResult: { code: 0 } })).resolves.toEqual({
    ruleId: "E-1.20.10",
    status: "pass",
    message: "",
  });
  await rm(root, { recursive: true, force: true });
});

test("reports every coverage metric below 100%", async () => {
  const root = await fixture({
    statements: { pct: 99 },
    branches: { pct: 98 },
    functions: { pct: 97 },
    lines: { pct: 96 },
  });
  await expect(run({ root, executeJest: true, jestResult: { code: 0 } })).resolves.toEqual(
    expect.objectContaining({
      ruleId: "E-1.20.10",
      status: "fail",
      message: expect.stringContaining("Aggregate gaps: statements, branches, functions, lines."),
    }),
  );
  await rm(root, { recursive: true, force: true });
});

test("fails when Jest does not produce a coverage summary", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-e-1-20-10-"));
  await expect(run({ root, executeJest: true, jestResult: { code: 0 } })).resolves.toEqual({
    ruleId: "E-1.20.10",
    status: "fail",
    message: "Coverage evidence is missing. Rerun Jest with coverage enabled.",
  });
  await rm(root, { recursive: true, force: true });
});

test("does not require Jest evidence for orchestration-only test seams", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-e-1-20-10-"));
  await expect(run({ root, executeJest: false })).resolves.toEqual({
    ruleId: "E-1.20.10",
    status: "pass",
    message: "",
  });
  await rm(root, { recursive: true, force: true });
});
