import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/E-1.5.mjs";

test("rejects coverage-ignore directives in source files", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-ignore-"));
  await writeFile(join(root, "clean.mjs"), "export const value = 1;\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(
    join(root, "unsafe.mjs"),
    `/* ${["istanbul", "ignore", "next"].join(" ")} */\nexport const value = 1;\n`,
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
