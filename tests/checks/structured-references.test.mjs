import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/A-1.25.0.0.mjs";
import {
  findStructuredReferenceGaps,
  jsonFilesUnder,
} from "../../src/checks/general/validate-structured-references.mjs";

test("accepts valid structured crosslinks", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-references-"));
  await mkdir(join(root, "specs"));
  await writeFile(join(root, "README.md"), "# readme\n");
  await writeFile(
    join(root, "specs", "record.json"),
    JSON.stringify({
      version: "8.0",
      crosslinks: [{ path: "../README.md", authoritativeFor: "readme" }],
    }),
  );
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "A-1.25.0.0", status: "pass" });
});

test("rejects unresolved structured crosslinks", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-references-"));
  await mkdir(join(root, "specs"));
  await writeFile(
    join(root, "specs", "record.json"),
    JSON.stringify({
      version: "8.0",
      crosslinks: [{ path: "../missing.json", authoritativeFor: "missing" }],
    }),
  );
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "A-1.25.0.0", status: "fail" });
});

test("passes when the root contains no structured files", async () => {
  await expect(run({ root: "C:/eliware/test8/missing-structured-root" })).resolves.toMatchObject({
    ruleId: "A-1.25.0.0",
    status: "pass",
  });
});

test("reports malformed records, unresolved wildcards, and invalid JSON", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-references-edge-"));
  await mkdir(join(root, "specs"));
  await mkdir(join(root, "docs"));
  await writeFile(join(root, "docs", "readme.md"), "ok\n");
  await writeFile(join(root, "docs", "extra.md"), "extra\n");
  await writeFile(join(root, "specs", "invalid.json"), "not-json");
  await writeFile(
    join(root, "specs", "malformed.json"),
    JSON.stringify({
      crosslinks: [
        null,
        {},
        { path: "../docs/readme.md" },
        { path: "../missing/*.md", authoritativeFor: "x" },
      ],
      nested: { valid: "../docs/readme.md", external: "https://example.com", anchor: "#section" },
    }),
  );
  const files = await jsonFilesUnder(root);
  const findings = await findStructuredReferenceGaps(root, files);
  expect(findings.join("\n")).toMatch(
    /invalid JSON|requires a path|authoritativeFor|unresolved reference/,
  );
  await writeFile(
    join(root, "specs", "valid-wildcard.json"),
    JSON.stringify({ crosslinks: [{ path: "../docs/*.md", authoritativeFor: "docs" }] }),
  );
  await writeFile(
    join(root, "specs", "non-array.json"),
    JSON.stringify({ crosslinks: "../docs/readme.md" }),
  );
  await writeFile(
    join(root, "specs", "no-crosslinks.json"),
    JSON.stringify({ version: "8.0", note: "no references" }),
  );
  await writeFile(
    join(root, "specs", "directory-reference.json"),
    JSON.stringify({ crosslinks: [{ path: "../docs/", authoritativeFor: "directory" }] }),
  );
  const extraFindings = await findStructuredReferenceGaps(root, await jsonFilesUnder(root));
  expect(extraFindings.join("\n")).toMatch(/crosslinks must be an array/);
});
