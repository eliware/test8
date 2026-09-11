import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function requireDocumentTerms(root, file, terms, message) {
  try {
    const text = (await readFile(join(root, file), "utf8")).toLowerCase();
    const missing = terms.filter((term) => !text.includes(term));
    return missing.length ? `${message}: ${missing.join(", ")}.` : "";
  } catch {
    return `${file} is required.`;
  }
}
