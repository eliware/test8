import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.22.0";
const directiveId = /^[EA]-\d+(?:\.\d+)*$/;

function inspectDirectives(items, file, state, parent = null) {
  if (!Array.isArray(items)) throw new Error(`${file}: directives must be an array.`);
  for (const item of items) {
    if (!item || typeof item.id !== "string" || !directiveId.test(item.id))
      throw new Error(`${file}: invalid directive ID.`);
    if (state.ids.has(item.id)) throw new Error(`${file}: duplicate directive ID ${item.id}.`);
    state.ids.add(item.id);
    if (!parent && item.id.startsWith("A-"))
      throw new Error(`${file}: top-level A-rule ${item.id}.`);
    if (parent && !item.id.split("-")[1].startsWith(`${parent.split("-")[1]}.`))
      throw new Error(`${file}: ${item.id} is not a child of ${parent}.`);
    if (parent?.startsWith("A-") && item.id.startsWith("E-"))
      throw new Error(`${file}: E-rule ${item.id} has an A-rule ancestor.`);
    inspectDirectives(item.directives ?? [], file, state, item.id);
  }
}

async function authorityNamespace(root, file, authorityMapPath) {
  try {
    const authorityMap = JSON.parse(await readFile(authorityMapPath, "utf8"));
    const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
    const repositoryUrl = packageJson.repository?.url;
    const repository = authorityMap.repositoryRegistry?.find(
      (entry) => repositoryUrl && repositoryUrl.endsWith(`/${entry.repository.split("/").pop()}`),
    );
    if (!repository?.directiveNamespaces?.length) return;
    const directives = JSON.parse(await readFile(file, "utf8")).directives;
    for (const item of directives) {
      if (
        !repository.directiveNamespaces.some(
          (namespace) => item.id === namespace || item.id.startsWith(`${namespace}.`),
        )
      )
        throw new Error(`${file}: ${item.id} is outside the repository directive namespace.`);
    }
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
}

export async function run({ root }) {
  try {
    const specs = join(root, "specs");
    const entries = await (
      await import("node:fs/promises")
    ).readdir(specs, { withFileTypes: true });
    const state = { ids: new Set() };
    for (const entry of entries.filter((item) => item.isFile() && item.name.endsWith(".json"))) {
      const file = join(specs, entry.name);
      const data = JSON.parse(await readFile(file, "utf8"));
      if (Array.isArray(data.directives)) {
        inspectDirectives(data.directives, file, state);
        await authorityNamespace(root, file, join(dirname(root), "docs", "authority-map.json"));
      }
    }
    return pass(ruleId);
  } catch (error) {
    return fail(ruleId, error.message);
  }
}
