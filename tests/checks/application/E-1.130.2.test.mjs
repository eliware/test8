import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/application/E-1.130.2.mjs";

test("requires docs/README.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-app-"));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await mkdir(join(root, "docs"));
  await writeFile(join(root, "docs", "README.md"), "# docs\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
