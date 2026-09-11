import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/library/A-1.40.1.mjs";

test("requires a documented runnable example", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-library-"));
  await mkdir(join(root, "examples"));
  await writeFile(join(root, "examples", "README.md"), "# examples\n");
  await expect(run({ root, packageJson: { name: "@eliware/fixture" } })).resolves.toMatchObject({
    status: "fail",
  });
  await writeFile(join(root, "examples", "basic.mjs"), "console.log(1);\n");
  await expect(run({ root, packageJson: { name: "@eliware/fixture" } })).resolves.toMatchObject({
    status: "pass",
  });
  await expect(run({ root, packageJson: { name: "other-package" } })).resolves.toMatchObject({
    status: "fail",
  });
});
