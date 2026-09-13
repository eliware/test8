import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { runCli } from "../../src/cli/run-cli.mjs";

test("reports the package version", async () => {
  const output = [];
  await expect(runCli(["--version"], (value) => output.push(value))).resolves.toBe(0);
  expect(output).toEqual(["8.0.0"]);
});

test("reports the convention-only help contract", async () => {
  const output = [];
  await expect(runCli(["--help"], (value) => output.push(value))).resolves.toBe(0);
  expect(output[0]).toContain("Usage: eliware-test");
  expect(output[0]).toContain("--debug-timing");
  expect(output[0]).not.toContain("--audit");
  expect(output[0]).not.toContain("--pack");
});

test("runs convention validation and reports debug timing when requested", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-cli-"));
  await writeFile(join(root, "README.md"), "# fixture\n");
  await writeFile(join(root, "AGENTS.md"), "eliware/docs eliware/conventions eliware/operations\n");
  await mkdir(join(root, "specs"));
  await writeFile(join(root, "specs", "README.md"), "# specs\n- [contracts.json](contracts.json)\n");
  await writeFile(
    join(root, "specs", "contracts.json"),
    JSON.stringify({
      schemaVersion: "1.0",
      contractVersion: "8.0",
      kind: "contract-reference",
      description: "fixture",
      authority: {},
      format: {},
      contracts: [{
        id: "C-1.1",
        title: "fixture",
        scope: "test",
        directiveIds: ["E-1.25"],
        dos: [],
        donts: [],
        contract: { purpose: "", inputs: [], outputs: [], errors: [], ordering: [], invariants: [], boundaries: {} },
        implementation: {},
        verification: {},
      }],
    }),
  );
  await writeFile(join(root, "package.json"), JSON.stringify({ eliware: { apply: ["fork"] } }));
  const output = [];
  await expect(
    runCli(["--debug-timing"], (value) => output.push(value), root, { executeJest: false }),
  ).resolves.toBe(0);
  expect(output).toHaveLength(1);
  expect(output[0]).toMatch(/^Validation time: \d+ms$/);
});

test("fails when package metadata cannot be read", async () => {
  const output = [];
  await expect(
    runCli([], (value) => output.push(value), "C:/path-that-does-not-exist", {
      executeJest: false,
    }),
  ).resolves.toBe(18);
  expect(output).toHaveLength(1);
  expect(output[0]).toMatch(/package\.json|ENOENT/i);
});

test("fails fast when package.json.eliware is absent", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-no-meta-"));
  await writeFile(join(root, "package.json"), JSON.stringify({ name: "fixture" }));
  const output = [];
  await expect(runCli([], (value) => output.push(value), root, { executeJest: false })).resolves.toBe(
    18,
  );
  expect(output).toEqual(["package.json.eliware is required for Eliware validation."]);
});
