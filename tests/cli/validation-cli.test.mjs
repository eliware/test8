import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { runCli } from "../../src/cli/run-cli.mjs";
import { runFormatCommand } from "../../src/cli/run-format-command.mjs";
import { runLintCommand } from "../../src/cli/run-lint-command.mjs";
import { findPublishMetadataGaps } from "../../src/checks/general/validate-publish-metadata.mjs";
import { findBasicPackageMetadataGaps } from "../../src/checks/general/validate-basic-package-metadata.mjs";
import { findPackedFileGaps } from "../../src/checks/general/validate-packed-files.mjs";
import { findUnsafeEnvironmentExample } from "../../src/checks/general/validate-env-example.mjs";
import { findTestMappingViolations } from "../../src/checks/general/find-test-mapping-violations.mjs";
import { findLineLimitViolations } from "../../src/checks/general/find-line-limit-violations.mjs";
import { walkFiles } from "../../src/checks/general/walk-files.mjs";
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

test("returns success for a passing validation run", async () => {
  const root = await fixture();
  const output = [];
  expect(
    await runCli(
      [],
      (value) => output.push(value),
      root,
      async () => ({ code: 0, results: [] }),
    ),
  ).toBe(0);
  expect(output).toEqual([]);
});

test("finds files over the line limit without counting a trailing newline", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-lines-"));
  const shortFile = join(root, "short.mjs");
  const longFile = join(root, "long.mjs");
  await writeFile(shortFile, "one\r\ntwo\r\n");
  await writeFile(longFile, "one\ntwo\nthree");

  await expect(findLineLimitViolations([shortFile, longFile], 2, root)).resolves.toEqual([
    "long.mjs (3 > 2)",
  ]);
});

test("walks files, skips excluded directories, and handles missing roots", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-walk-"));
  await mkdir(join(root, "nested"));
  await mkdir(join(root, "node_modules"));
  const file = join(root, "nested", "file.mjs");
  await writeFile(file, "content");
  await writeFile(join(root, "node_modules", "ignored.mjs"), "content");

  await expect(walkFiles(root)).resolves.toEqual([file]);
  await expect(walkFiles(join(root, "missing"))).resolves.toEqual([]);
});

test("reports discovery depth and file-count limits", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-walk-limits-"));
  await mkdir(join(root, "nested"));
  await writeFile(join(root, "nested", "file.mjs"), "content");
  await expect(walkFiles(root, { maxDepth: 0 })).rejects.toThrow(/depth limit \(0\)/);
  await expect(walkFiles(root, { maxFiles: 0 })).rejects.toThrow(/file limit \(0\)/);
});

test("propagates non-missing-root read errors", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-walk-error-"));
  const file = join(root, "file");
  await writeFile(file, "content");
  await expect(walkFiles(file)).rejects.toMatchObject({ code: "ENOTDIR" });
});

test("ignores directory entries that are neither files nor directories", async () => {
  const entry = { name: "link", isDirectory: () => false, isFile: () => false };
  await expect(walkFiles("C:/fixture", { readDirectory: async () => [entry] })).resolves.toEqual(
    [],
  );
});

test("returns a validation failure code for invalid configuration", async () => {
  const root = await fixture("7.0");
  const output = [];
  expect(await runCli([], (value) => output.push(value), root)).toBe(18);
  expect(output[0]).toMatch(/version must be 8\.0/);
});

test("forwards coverage opt-out through the application seam", async () => {
  const root = await fixture();
  let received;
  const result = await runCli(
    ["--ignore-100x4"],
    () => {},
    root,
    async (options) => {
      received = options.args;
      return { code: 0, results: [] };
    },
  );
  expect(result).toBe(0);
  expect(received).toEqual(["--ignore-100x4"]);
});

test("forwards monolith diagnostic options through the application seam", async () => {
  const root = await fixture();
  let received;
  const result = await runCli(
    ["--ignore-monolith-limits"],
    () => {},
    root,
    async (options) => {
      received = options.diagnosticOptions;
      return { code: 0, results: [] };
    },
  );
  expect(result).toBe(0);
  expect(received).toEqual({ ignoredRuleIds: ["A-18.5.2"] });
});

test("runs format-check through the dedicated command adapter", async () => {
  await expect(runFormatCommand(process.cwd(), true)).resolves.toBe(0);
});

test("runs format write mode through the dedicated command adapter", async () => {
  await expect(runFormatCommand(process.cwd(), false)).resolves.toBe(0);
});

test("runs lint through the dedicated command adapter", async () => {
  const output = [];
  await expect(runLintCommand(process.cwd(), (value) => output.push(value))).resolves.toBe(0);
  expect(output).toEqual([]);
});

test("writes lint diagnostics and returns the stage status", async () => {
  const output = [];
  await expect(
    runLintCommand(
      "C:/fixture",
      (value) => output.push(value),
      async (root) => {
        expect(root).toBe("C:/fixture");
        return { code: 12, category: "lint", output: "warning" };
      },
    ),
  ).resolves.toBe(12);
  expect(output).toEqual(["warning"]);
});

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
