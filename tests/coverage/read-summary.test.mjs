import { expect, test } from "@jest/globals";
import { readCoverageSummary } from "../../src/coverage/read-summary.mjs";

test("reads the total coverage summary", async () => {
  const result = await readCoverageSummary({
    readFile: async () =>
      JSON.stringify({
        total: {
          statements: { pct: 100 },
          branches: { pct: 100 },
          functions: { pct: 100 },
          lines: { pct: 100 },
        },
      }),
  });
  expect(result).toEqual({ statements: 100, branches: 100, functions: 100, lines: 100 });
});

test("rejects incomplete coverage summary evidence", async () => {
  await expect(
    readCoverageSummary({ readFile: async () => JSON.stringify({ total: {} }) }),
  ).rejects.toThrow(/coverage summary/);
});

test("retains zero-valued metrics as usable coverage evidence", async () => {
  await expect(
    readCoverageSummary({
      readFile: async () =>
        JSON.stringify({
          total: {
            statements: { pct: 0 },
            branches: { pct: 100 },
            functions: { pct: 100 },
            lines: { pct: 100 },
          },
        }),
    }),
  ).resolves.toEqual({ statements: 0, branches: 100, functions: 100, lines: 100 });
});

test("rejects malformed JSON coverage evidence", async () => {
  await expect(readCoverageSummary({ readFile: async () => "not-json" })).rejects.toThrow(
    /coverage summary/,
  );
});

test("falls back to the Jest text summary when JSON is unavailable", async () => {
  await expect(
    readCoverageSummary({
      readFile: async () =>
        "File | % Stmts | % Branch | % Funcs | % Lines |\nAll files | 99 | 100 | 98.5 | 100 |",
    }),
  ).resolves.toEqual({ statements: 99, branches: 100, functions: 98.5, lines: 100 });
});

test("rejects text without a usable aggregate coverage row", async () => {
  await expect(
    readCoverageSummary({
      readFile: async () => "File | % Stmts | % Branch | % Funcs | % Lines |",
    }),
  ).rejects.toThrow(/coverage summary/);
});

test("rejects a report that predates the validation run", async () => {
  await expect(
    readCoverageSummary({
      readFile: async () =>
        JSON.stringify({
          total: {
            statements: { pct: 100 },
            branches: { pct: 100 },
            functions: { pct: 100 },
            lines: { pct: 100 },
          },
        }),
      stat: async () => ({ mtimeMs: 10 }),
      reportPath: "C:/repo/coverage/coverage-summary.json",
      startedAt: 20,
    }),
  ).rejects.toThrow(/stale/);
});

test("rejects a report that changes while being read", async () => {
  let reads = 0;
  await expect(
    readCoverageSummary({
      readFile: async () =>
        JSON.stringify({
          total: {
            statements: { pct: 100 },
            branches: { pct: 100 },
            functions: { pct: 100 },
            lines: { pct: 100 },
          },
        }),
      stat: async () => ({ mtimeMs: ++reads === 1 ? 30 : 31 }),
      reportPath: "C:/repo/coverage/coverage-summary.json",
      startedAt: 20,
    }),
  ).rejects.toThrow(/changed/);
});
