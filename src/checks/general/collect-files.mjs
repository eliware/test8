import { walkFiles } from "./walk-files.mjs";

export async function collectFiles(root, suffix) {
  return (await walkFiles(root)).filter((file) => file.endsWith(suffix));
}
