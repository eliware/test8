import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../../src/checks/general/E-1/E-1.25/A-1.25.0/A-1.25.1.mjs";

async function fixture(overrides = {}) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-contracts-"));
  await mkdir(join(root, "specs"));
  const contract = {
    schemaVersion: "1.0",
    contractVersion: "8.0",
    kind: "contract-reference",
    description: "fixture",
    authority: {},
    format: {},
    contracts: [
      {
        id: "C-1.1",
        title: "fixture",
        scope: "test",
        directiveIds: ["E-1.25"],
        dos: [],
        donts: [],
        contract: {
          purpose: "fixture",
          inputs: [],
          outputs: [],
          errors: [],
          ordering: [],
          invariants: [],
          boundaries: {},
        },
        implementation: {},
        verification: {},
      },
    ],
    ...overrides,
  };
  await writeFile(join(root, "specs", "contracts.json"), JSON.stringify(contract));
  await writeFile(join(root, "specs", "README.md"), "- [contracts.json](contracts.json)");
  return root;
}

async function cleanup(root) {
  await rm(root, { recursive: true, force: true });
}

test("passes a complete shared contract record", async () => {
  const root = await fixture();
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.25.1", status: "pass", message: "" });
  await cleanup(root);
});

test("rejects an unindexed contracts file", async () => {
  const root = await fixture();
  await writeFile(join(root, "specs", "README.md"), "# specs");
  await expect(run({ root })).resolves.toEqual(
    expect.objectContaining({ status: "fail", message: "specs/README.md must link specs/contracts.json." }),
  );
  await cleanup(root);
});

test("rejects duplicate contract IDs", async () => {
  const root = await fixture();
  const path = join(root, "specs", "contracts.json");
  const contract = JSON.parse(await readFile(path, "utf8"));
  contract.contracts.push({ ...contract.contracts[0] });
  await writeFile(path, JSON.stringify(contract));
  await expect(run({ root })).resolves.toEqual(
    expect.objectContaining({ status: "fail", message: "Contract ID is missing, duplicated, or invalid: C-1.1." }),
  );
  await cleanup(root);
});

test("rejects cyclic contract references", async () => {
  const root = await fixture({
    contracts: [
      {
        id: "C-1.1",
        title: "one",
        scope: "test",
        directiveIds: ["E-1.25"],
        dos: [],
        donts: [],
        contract: { purpose: "", inputs: [], outputs: [], errors: [], ordering: [], invariants: [], boundaries: {} },
        implementation: {},
        verification: {},
        dependencies: ["C-1.2"],
      },
      {
        id: "C-1.2",
        title: "two",
        scope: "test",
        directiveIds: ["E-1.25"],
        dos: [],
        donts: [],
        contract: { purpose: "", inputs: [], outputs: [], errors: [], ordering: [], invariants: [], boundaries: {} },
        implementation: {},
        verification: {},
        dependencies: ["C-1.1"],
      },
    ],
  });
  await expect(run({ root })).resolves.toEqual(
    expect.objectContaining({ status: "fail", message: "Contract parent and dependency references must resolve without cycles." }),
  );
  await cleanup(root);
});
