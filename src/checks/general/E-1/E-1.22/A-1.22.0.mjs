import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "A-1.22.0";
export const parentRuleId = "E-1.22";

function walk(node, parent, ancestry, ids, errors) {
  if (!node || typeof node.id !== "string" || !/^[EA]-\d+(?:\.\d+)*$/.test(node.id)) {
    errors.push("Every directive must have a valid E- or A-prefixed ID.");
    return;
  }
  if (ids.has(node.id)) errors.push(`Directive IDs must be unique: ${node.id}.`);
  ids.add(node.id);
  if (parent && !node.id.slice(2).startsWith(`${parent.id.slice(2)}.`)) errors.push(`Directive ${node.id} must be nested under ${parent.id}.`);
  if (!parent && !node.id.startsWith("E-")) errors.push(`Top-level directive ${node.id} must be an E-rule.`);
  if (node.id.startsWith("E-") && ancestry.some((id) => id.startsWith("A-"))) {
    errors.push(`E-rule ${node.id} cannot be nested under an A-rule.`);
  }
  if (node.id.startsWith("A-") && !ancestry.some((id) => id.startsWith("E-"))) {
    errors.push(`A-rule ${node.id} must have an E-rule ancestor.`);
  }
  if (node.directives !== undefined && !Array.isArray(node.directives)) errors.push(`Directive ${node.id}.directives must be an array.`);
  for (const child of node.directives ?? []) walk(child, node, [...ancestry, node.id], ids, errors);
}

export async function run({ root }) {
  let document;
  try {
    document = JSON.parse(await readFile(join(root, "specs", "directives.json"), "utf8"));
  } catch {
    return fail(ruleId, "specs/directives.json is required and must be valid JSON.");
  }
  if (!Array.isArray(document.directives) || document.directives.length === 0) {
    return fail(ruleId, "specs/directives.json must contain one or more directives.");
  }
  const errors = [];
  const ids = new Set();
  for (const directive of document.directives) walk(directive, null, [], ids, errors);
  return errors.length > 0 ? fail(ruleId, errors.join(" ")) : pass(ruleId);
}
