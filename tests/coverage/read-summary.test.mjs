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
