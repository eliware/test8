import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../src/checks/general/E-1/E-1.5.mjs";

test("rejects coverage-ignore directives outside pure barrels", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-ignore-"));
  await mkdir(join(root, "src"));
  await writeFile(join(root, "src", "clean.mjs"), "export const value = 1;\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "src", "unsafe.mjs"), "/* istanbul ignore next */\nexport const value = 1;\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});

test("allows coverage-ignore directives in pure export barrels", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-barrel-ignore-"));
  await mkdir(join(root, "src"));
  await writeFile(join(root, "src", "barrel.mjs"), "/* istanbul ignore file */\nexport * from './value.mjs';\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
