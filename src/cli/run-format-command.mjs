import { runChild } from "../process/run-child.mjs";

export async function runFormatCommand(root, check) {
  const mode = check ? "--check" : "--write";
  const result = await runChild(
    "node",
    ["node_modules/prettier/bin/prettier.cjs", mode, ".", "--ignore-path", ".gitignore"],
    { cwd: root },
  );
  return result.code;
}
