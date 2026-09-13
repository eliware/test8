import { expect, test } from "@jest/globals";
import { parseDetailed, parseSummary, parseText } from "../../../../../../src/checks/general/E-1/E-1.20/E-1.20.10/coverage-parsers.mjs";

test("parses summary, text, and detailed coverage evidence", () => {
  expect(parseSummary({ total: { statements: { pct: 100 }, branches: { pct: 99 }, functions: { pct: 100 }, lines: { pct: 100 } } }).totals.branches).toBe(99);
  expect(parseText("All files | 100 | 99 | 100 | 100 |\n").totals.branches).toBe(99);
  expect(parseDetailed({ "src/example.mjs": { statementMap: { "0": { start: { line: 4 } } }, s: { "0": 0 } } }).gaps).toHaveLength(1);
});
