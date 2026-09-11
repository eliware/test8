import { access } from "node:fs/promises";
import { join } from "node:path";

export async function findMissingSurfaceIndexes(root, surfaces) {
  const missing = [];
  for (const surface of surfaces) {
    try {
      await access(join(root, surface, "README.md"));
    } catch {
      missing.push(`${surface}/README.md`);
    }
  }
  return missing;
}
