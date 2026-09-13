import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/application/E-1.130/E-1.130.2.mjs";

test("requires and links the application docs index", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-app-docs-"));
  await mkdir(join(root, "docs"));
  await writeFile(join(root, "docs", "README.md"), "# Docs");
  await writeFile(join(root, "README.md"), "[Documentation](docs/README.md)");
  await expect(run({ root })).resolves.toEqual({ ruleId: "E-1.130.2", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
