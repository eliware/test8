import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/documentation/E-1.100/E-1.100.1.mjs";

test("requires linked documentation indexes", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-doc-index-"));
  await mkdir(join(root, "docs"));
  await writeFile(join(root, "README.md"), "docs/README.md");
  await writeFile(join(root, "docs", "README.md"), "guide.md");
  await writeFile(join(root, "docs", "guide.md"), "guide");
  await expect(run({ root })).resolves.toEqual({ ruleId: "E-1.100.1", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
