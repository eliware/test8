import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { findPublishMetadataGaps } from "../../src/checks/general/validate-publish-metadata.mjs";
import { findBasicPackageMetadataGaps } from "../../src/checks/general/validate-basic-package-metadata.mjs";
import { findPackedFileGaps } from "../../src/checks/general/validate-packed-files.mjs";
import { findUnsafeEnvironmentExample } from "../../src/checks/general/validate-env-example.mjs";
import { findTestMappingViolations } from "../../src/checks/general/find-test-mapping-violations.mjs";
import { run as runAgentsCheck } from "../../src/checks/general/E-1.0.mjs";

async function fixture(version = "8.0") {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-cli-"));
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({
      name: "fixture",
      version: "1.0.0",
      description: "fixture",
      type: "module",
      eliware: { conventions: { version, apply: ["general"] } },
    }),
  );
  await writeFile(join(root, "AGENTS.md"), "# fixture\n");
  await writeFile(join(root, "README.md"), "# fixture\n");
  await writeFile(join(root, "RELEASE_NOTES.md"), "# Release notes\n");
  await mkdir(join(root, "specs"));
  await writeFile(join(root, "specs", "README.md"), "# specs\n");
  return root;
}
test("skips publish metadata requirements for private packages", () => {
  expect(findPublishMetadataGaps({ private: true })).toEqual([]);
});

test("reports missing publish metadata for public packages", () => {
  expect(findPublishMetadataGaps({})).toEqual([
    "repository metadata",
    "homepage metadata",
    "publishConfig metadata",
    "files: README.md",
    "files: LICENSE",
    "files: RELEASE_NOTES.md",
  ]);
});

test("accepts complete basic package metadata", () => {
  expect(
    findBasicPackageMetadataGaps({
      author: "Eliware",
      keywords: ["eliware"],
      repository: { url: "https://github.com/eliware/test" },
      bugs: "https://github.com/eliware/test/issues",
      homepage: "https://github.com/eliware/test#readme",
    }),
  ).toEqual([]);
});

test("reports invalid basic package metadata", () => {
  expect(
    findBasicPackageMetadataGaps({
      author: " ",
      keywords: [""],
      repository: { url: "not-a-url" },
      bugs: "ftp://invalid.example",
      homepage: 42,
    }),
  ).toEqual(["author", "keywords", "repository URL", "bugs URL"]);
});

test("reports npm pack process failures", async () => {
  await expect(
    findPackedFileGaps("C:/repo", {}, async () => ({ code: 1, stdout: "" })),
  ).resolves.toEqual(["npm pack --dry-run failed"]);
});

test("reports invalid npm pack JSON", async () => {
  await expect(
    findPackedFileGaps("C:/repo", {}, async () => ({ code: 0, stdout: "not-json" })),
  ).resolves.toEqual(["npm pack --dry-run returned invalid JSON"]);
});

test("reports unexpected packed files", async () => {
  await expect(
    findPackedFileGaps("C:/repo", { files: ["src"] }, async () => ({
      code: 0,
      stdout: JSON.stringify([{ files: [{ path: "secret.txt" }] }]),
    })),
  ).resolves.toEqual(["unexpected packed files: secret.txt"]);
});

test("accepts metadata and files under an allowed package surface", async () => {
  await expect(
    findPackedFileGaps("C:/repo", { files: ["src"] }, async () => ({
      code: 0,
      stdout: JSON.stringify([{ files: [{ path: "package.json" }, { path: "src/index.mjs" }] }]),
    })),
  ).resolves.toEqual([]);
});

test("accepts a valid pack result with no listed files", async () => {
  await expect(
    findPackedFileGaps("C:/repo", {}, async () => ({ code: 0, stdout: "[{}]" })),
  ).resolves.toEqual([]);
});

test("reports empty environment placeholders", async () => {
  const root = await fixture();
  await writeFile(join(root, ".env.example"), "PORT=\n");
  await expect(findUnsafeEnvironmentExample(join(root, ".env.example"))).resolves.toEqual([
    expect.stringContaining("PORT needs a placeholder value"),
  ]);
});

test("requires mirrored tests for source modules", async () => {
  const root = await fixture();
  await mkdir(join(root, "src"));
  await writeFile(join(root, "src", "value.mjs"), "export const value = 1;\n");
  expect(await findTestMappingViolations(root)).toEqual(["src\\value.mjs"]);
  await mkdir(join(root, "tests"));
  await writeFile(join(root, "tests", "value.test.mjs"), 'test("value", () => {});\n');
  expect(await findTestMappingViolations(root)).toEqual([]);
  await mkdir(join(root, "src", "checks"));
  await writeFile(join(root, "src", "checks", "custom.mjs"), "export const value = 1;\n");
  expect(await findTestMappingViolations(root)).toContain("src\\checks\\custom.mjs");
  await mkdir(join(root, "tests", "checks"));
  await writeFile(
    join(root, "tests", "checks", "all-convention-checks.test.mjs"),
    'test("all", () => {});\n',
  );
  expect(await findTestMappingViolations(root)).not.toContain("src\\checks\\custom.mjs");
  await writeFile(join(root, "src", "index.mjs"), "export {};");
  expect(await findTestMappingViolations(root)).not.toContain("src\\index.mjs");
});

test("fails when the repository AGENTS.md is absent", async () => {
  const root = await fixture();
  await expect(runAgentsCheck({ root })).resolves.toEqual({
    ruleId: "E-1.0",
    status: "pass",
    message: "",
  });
  const { rm } = await import("node:fs/promises");
  await rm(join(root, "AGENTS.md"));
  await expect(runAgentsCheck({ root })).resolves.toEqual({
    ruleId: "E-1.0",
    status: "fail",
    message: "AGENTS.md is required at the repository root.",
  });
});
