import { expect, test } from "@jest/globals";
import { formatCoverageGaps } from "../../../../../../src/checks/general/E-1/E-1.20/E-1.20.10/format-coverage-gaps.mjs";

test("formats detailed coverage gaps with remediation guidance", () => {
  const output = formatCoverageGaps({
    gaps: [{
      file: "src/example.mjs",
      metrics: { statements: 0, branches: 50, functions: 0, lines: 0 },
      lines: [4],
      statements: [{ location: "4" }],
      branches: [{ location: "6" }],
      functions: [{ name: "example", location: "8" }],
    }],
  });
  expect(output).toContain("src/example.mjs | 0.00% | 50.00% | 0.00% | 0.00%");
  expect(output).toContain("Uncovered statements: 4");
  expect(output).toContain("Uncovered branches: 6 (uncovered)");
  expect(output).toContain("Uncovered functions: example at 8");
  expect(output).toContain("Remediation: Add or extend tests");
});
