import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function readPackageJson(root) {
  return JSON.parse(await readFile(join(root, "package.json"), "utf8"));
}
