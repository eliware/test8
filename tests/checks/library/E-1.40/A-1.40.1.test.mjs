import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../src/checks/library/E-1.40/A-1.40.1.mjs";

test("requires library docs, examples, and allowlist", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-"));
  await mkdir(join(root, "docs"));
  await mkdir(join(root, "examples"));
  await writeFile(join(root, "docs", "README.md"), "docs");
  await writeFile(join(root, "examples", "README.md"), "examples");
  await writeFile(join(root, "examples", "basic.mjs"), "example");
  expect((await run({ root, packageJson: { files: ["src"] } })).status).toBe("pass");
  expect((await run({ root, packageJson: { files: [] } })).status).toBe("fail");
});
