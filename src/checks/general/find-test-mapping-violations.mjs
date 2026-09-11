import { relative, join } from "node:path";
import { collectFiles } from "./collect-files.mjs";

export async function findTestMappingViolations(root) {
  const sourceFiles = await collectFiles(join(root, "src"), ".mjs");
  const testFiles = new Set(await collectFiles(join(root, "tests"), ".test.mjs"));
  return sourceFiles
    .filter((source) => !source.endsWith("/index.mjs") && !source.endsWith("\\index.mjs"))
    .filter((source) => {
      const expected = join(root, "tests", relative(join(root, "src"), source)).replace(
        /\.mjs$/,
        ".test.mjs",
      );
      return !testFiles.has(expected);
    })
    .map((source) => relative(root, source));
}
