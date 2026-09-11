import { runCli } from "../../src/cli/run-cli.mjs";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("reports the package version", async () => {
  const output = [];
  await expect(runCli(["--version"], (value) => output.push(value))).resolves.toBe(0);
  expect(output).toEqual(["8.0.0"]);
});

test("reports help", async () => {
  const output = [];
  await expect(runCli(["--help"], (value) => output.push(value))).resolves.toBe(0);
  expect(output[0]).toContain("Usage: eliware-test");
  expect(output[0]).toContain("--debug-timing");
});

test("supports lint and formatting command modes", async () => {
  await expect(runCli(["--lint"], () => {}, process.cwd())).resolves.toBe(0);
  await expect(runCli(["--format"], () => {}, process.cwd())).resolves.toBe(0);
  await expect(runCli(["--format-check"], () => {}, process.cwd())).resolves.toBe(0);
});

test("uses console logging when no writer is supplied", async () => {
  await expect(runCli(["--version"])).resolves.toBe(0);
});

test("reports timing only when debug timing is requested", async () => {
  const output = [];
  const application = async () => ({ code: 0, results: [] });
  await expect(
    runCli(["--debug-timing"], (value) => output.push(value), process.cwd(), application),
  ).resolves.toBe(0);
  expect(output).toHaveLength(1);
  expect(output[0]).toMatch(/^Validation time: \d+ms$/);
});

test("prints diagnostics for failed validation stages", async () => {
  const output = [];
  const application = async () => ({
    code: 8,
    results: [{ category: "tests", code: 8, output: "Jest failed" }],
  });
  await expect(runCli([], (value) => output.push(value), process.cwd(), application)).resolves.toBe(
    8,
  );
  expect(output).toContain("Jest failed");
});

test("passes the coverage callback through with the requested opt-out", async () => {
  let received;
  const application = async ({ runCoverage }) => {
    received = await runCoverage();
    return { code: 0, results: [] };
  };
  await expect(
    runCli(
      ["--ignore-100x4"],
      () => {},
      process.cwd(),
      application,
      async (root, ignore100x4) => ({ root, ignore100x4 }),
    ),
  ).resolves.toBe(0);
  expect(received).toEqual({ root: process.cwd(), ignore100x4: true });
});

test("returns the internal error code when package metadata cannot be read", async () => {
  const output = [];
  await expect(
    runCli([], (value) => output.push(value), "C:/path-that-does-not-exist"),
  ).resolves.toBe(18);
  expect(output).toHaveLength(1);
  expect(output[0]).toMatch(/package\.json|ENOENT/i);
});

test("fails fast when package.json.eliware is absent", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-no-meta-"));
  await writeFile(join(root, "package.json"), JSON.stringify({ name: "fixture" }));
  const output = [];
  await expect(runCli([], (value) => output.push(value), root)).resolves.toBe(18);
  expect(output).toEqual(["package.json.eliware is required for Eliware validation."]);
});
