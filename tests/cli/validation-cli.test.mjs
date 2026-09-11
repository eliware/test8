import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { runCli } from "../../src/cli/run-cli.mjs";
import { runFormatCommand } from "../../src/cli/run-format-command.mjs";
import { runLintCommand } from "../../src/cli/run-lint-command.mjs";
import { findLineLimitViolations } from "../../src/checks/general/find-line-limit-violations.mjs";
import { walkFiles } from "../../src/checks/general/walk-files.mjs";
import { run as runMonolith } from "../../src/checks/general/A-18.5.2.mjs";

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

test("reports source and test monolith violations", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-monolith-"));
  await mkdir(join(root, "src"));
  await mkdir(join(root, "tests"));
  await writeFile(join(root, "src", "long.mjs"), `${"line\n".repeat(101)}`);
  await writeFile(join(root, "tests", "long.test.mjs"), `${"line\n".repeat(201)}`);
  await expect(runMonolith({ root })).resolves.toMatchObject({
    ruleId: "A-18.5.2",
    status: "fail",
    message: expect.stringContaining("src\\long.mjs"),
  });
});

test("passes monolith validation when source and tests are within limits", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-monolith-pass-"));
  await mkdir(join(root, "src"));
  await mkdir(join(root, "tests"));
  await writeFile(join(root, "src", "short.mjs"), "export const value = 1;\n");
  await writeFile(join(root, "tests", "short.test.mjs"), 'test("ok", () => {});\n');
  await expect(runMonolith({ root })).resolves.toEqual({
    ruleId: "A-18.5.2",
    status: "pass",
    message: "",
  });
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
