import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { runCli } from "../../src/cli/run-cli.mjs";

async function fixture(withConfiguration = true) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-cli-"));
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({
      name: "fixture",
      version: "1.0.0",
      type: "module",
      ...(withConfiguration ? { eliware: { apply: ["general"] } } : {}),
    }),
  );
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
  return root;
}

test("returns success for a configured convention validation run", async () => {
  const root = await fixture();
  const output = [];
  await expect(
    runCli([], (value) => output.push(value), root, { executeJest: false }),
  ).resolves.toBe(0);
  expect(output).toEqual([]);
});

test("fails fast for missing Eliware configuration", async () => {
  const root = await fixture(false);
  const output = [];
  await expect(runCli([], (value) => output.push(value), root)).resolves.toBe(18);
  expect(output).toEqual(["package.json.eliware is required for Eliware validation."]);
});
