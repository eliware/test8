import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/documentation/E-1.100.1.mjs";

test("requires root and docs indexes", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-docs-"));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "README.md"), "# root\n");
  await mkdir(join(root, "docs"));
  await writeFile(join(root, "docs", "README.md"), "# docs\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
