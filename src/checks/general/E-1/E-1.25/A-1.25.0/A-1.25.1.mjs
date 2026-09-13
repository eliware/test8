import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../../check-result.mjs";

export const ruleId = "A-1.25.1";
export const parentRuleId = "A-1.25.0";

const contractIdPattern = /^C-\d+(?:\.\d+)*$/;
const directiveIdPattern = /^[EA]-\d+(?:\.\d+)*$/;
const topLevelFields = [
  "schemaVersion",
  "contractVersion",
  "kind",
  "description",
  "authority",
  "format",
  "contracts",
];
const contractFields = [
  "id",
  "title",
  "scope",
  "directiveIds",
  "dos",
  "donts",
  "contract",
  "implementation",
  "verification",
];
const contractSections = ["purpose", "inputs", "outputs", "errors", "ordering", "invariants", "boundaries"];

function hasOwnValues(value, fields) {
  return fields.every((field) => Object.hasOwn(value, field));
}

function referencesResolve(contracts) {
  const ids = new Set(contracts.map(({ id }) => id));
  const edges = new Map(contracts.map(({ id }) => [id, []]));
  for (const contract of contracts) {
    const references = [contract.parent, ...(contract.dependencies ?? [])].filter(Boolean);
    if (references.some((reference) => !ids.has(reference))) return false;
    edges.set(contract.id, references);
  }
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) return false;
    if (visited.has(id)) return true;
    visiting.add(id);
    for (const reference of edges.get(id)) if (!visit(reference)) return false;
    visiting.delete(id);
    visited.add(id);
    return true;
  }
  return [...ids].every(visit);
}

export async function run({ root }) {
  let contracts;
  let index;
  try {
    [contracts, index] = await Promise.all([
      readFile(join(root, "specs", "contracts.json"), "utf8").then(JSON.parse),
      readFile(join(root, "specs", "README.md"), "utf8"),
    ]);
  } catch {
    return fail(ruleId, "specs/contracts.json and specs/README.md are required and must be readable.");
  }
  if (!hasOwnValues(contracts, topLevelFields) || contracts.kind !== "contract-reference") {
    return fail(ruleId, "specs/contracts.json must use the shared contract-reference top-level format.");
  }
  if (!Array.isArray(contracts.contracts) || contracts.contracts.length === 0) {
    return fail(ruleId, "specs/contracts.json must declare at least one contract.");
  }
  const ids = new Set();
  for (const contract of contracts.contracts) {
    if (!contract || typeof contract !== "object" || !hasOwnValues(contract, contractFields)) {
      return fail(ruleId, "Every contract must contain the shared required fields.");
    }
    if (ids.has(contract.id) || !contractIdPattern.test(contract.id)) {
      return fail(ruleId, `Contract ID is missing, duplicated, or invalid: ${contract.id ?? "unknown"}.`);
    }
    ids.add(contract.id);
    if (!Array.isArray(contract.directiveIds) || contract.directiveIds.some((id) => !directiveIdPattern.test(id))) {
      return fail(ruleId, `Contract ${contract.id} has invalid directive references.`);
    }
    if (!contractSections.every((section) => Object.hasOwn(contract.contract, section))) {
      return fail(ruleId, `Contract ${contract.id} is missing a required behavior section.`);
    }
  }
  if (!referencesResolve(contracts.contracts)) {
    return fail(ruleId, "Contract parent and dependency references must resolve without cycles.");
  }
  if (!index.includes("contracts.json")) {
    return fail(ruleId, "specs/README.md must link specs/contracts.json.");
  }
  return pass(ruleId);
}
