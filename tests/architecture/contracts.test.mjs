import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "@jest/globals";

async function readJson(relativePath) {
  return JSON.parse(await readFile(join(process.cwd(), relativePath), "utf8"));
}

function collectDirectiveIds(nodes, parent = null, output = new Map()) {
  for (const node of nodes) {
    output.set(node.id, parent);
    collectDirectiveIds(node.directives ?? [], node.id, output);
  }
  return output;
}

test("contracts document has the shared atomic contract envelope", async () => {
  const contracts = await readJson("specs/contracts.json");
  expect(contracts).toEqual(
    expect.objectContaining({
      schemaVersion: "1.0",
      contractVersion: "8.0",
      kind: "contract-reference",
      authority: expect.any(Object),
      terminology: expect.any(Object),
      format: expect.any(Object),
      contracts: expect.any(Array),
    }),
  );
  expect(contracts.contracts).toHaveLength(12);
});

test("each contract is atomic, traceable, and structurally uniform", async () => {
  const contracts = await readJson("specs/contracts.json");
  const ids = contracts.contracts.map(({ id }) => id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const contract of contracts.contracts) {
    expect(contract).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(/^C-\d+\.\d+$/),
        title: expect.any(String),
        scope: expect.any(String),
        directiveIds: expect.any(Array),
        dos: expect.any(Array),
        donts: expect.any(Array),
        contract: expect.objectContaining({
          inputs: expect.any(Object),
          outputs: expect.any(Object),
          errors: expect.any(Array),
          ordering: expect.any(Array),
          invariants: expect.any(Array),
          boundaries: expect.objectContaining({
            owns: expect.any(Array),
            doesNotOwn: expect.any(Array),
          }),
        }),
        implementation: expect.objectContaining({ source: expect.any(Array) }),
        verification: expect.objectContaining({
          tests: expect.any(Array),
          commands: expect.any(Array),
        }),
      }),
    );
  }
});

test("contract directive references resolve to local Test8 directives", async () => {
  const [contracts, directives] = await Promise.all([
    readJson("specs/contracts.json"),
    readJson("specs/directives.json"),
  ]);
  const directiveIds = collectDirectiveIds(directives.directives);
  const referenced = contracts.contracts.flatMap(({ directiveIds: ids }) => ids);
  expect(referenced.every((id) => directiveIds.has(id))).toBe(true);
});
