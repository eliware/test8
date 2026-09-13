import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { readCoverageEvidence } from "../../../../../../src/checks/general/E-1/E-1.20/E-1.20.10/coverage-evidence.mjs";

async function fixture(name, contents) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-coverage-evidence-"));
  await mkdir(join(root, "coverage"));
  await writeFile(join(root, "coverage", name), contents);
  return root;
}

test("reads aggregate summary evidence", async () => {
  const root = await fixture(
    "coverage-summary.json",
    JSON.stringify({ total: { statements: { pct: 100 }, branches: { pct: 99 }, functions: { pct: 100 }, lines: { pct: 100 } } }),
  );
  await expect(readCoverageEvidence(root)).resolves.toMatchObject({
    source: "coverage/coverage-summary.json",
    totals: { statements: 100, branches: 99, functions: 100, lines: 100 },
  });
  await rm(root, { recursive: true, force: true });
});

test("reads detailed Istanbul evidence and identifies locations", async () => {
  const root = await fixture(
    "coverage-final.json",
    JSON.stringify({
      "src/example.mjs": {
        statementMap: { "0": { start: { line: 4, column: 0 } } },
        s: { "0": 0 },
        branchMap: { "0": { locations: [{ start: { line: 6, column: 0 } }] } },
        b: { "0": [0] },
        fnMap: { "0": { name: "example", start: { line: 8, column: 0 } } },
        f: { "0": 0 },
      },
    }),
  );
  await expect(readCoverageEvidence(root)).resolves.toMatchObject({
    gaps: [{ file: "src/example.mjs", lines: ["4"], statements: [{ location: "4" }] }],
  });
  await rm(root, { recursive: true, force: true });
});

test("falls back to the Jest text summary", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-coverage-evidence-"));
  await expect(
    readCoverageEvidence(root, "All files | 100 | 100 | 100 | 100 |\n"),
  ).resolves.toMatchObject({ source: "Jest text output", totals: { lines: 100 } });
  await rm(root, { recursive: true, force: true });
});
