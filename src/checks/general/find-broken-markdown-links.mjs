import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const markdownLink = /!?(?:\[[^\]]*\])\(([^)\s]+)(?:\s+[^)]*)?\)/g;

export async function findBrokenMarkdownLinks(files) {
  const broken = [];
  for (const file of files) {
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(markdownLink)) {
      const target = match[1];
      if (/^(?:[a-z]+:|\/\/|#)/i.test(target)) continue;
      const path = resolve(dirname(file), target.split("#")[0]);
      try {
        await access(path);
      } catch {
        broken.push(`${file}: ${target}`);
      }
    }
  }
  return broken;
}
