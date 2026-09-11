import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/E-1.2.mjs";

test("requires the specification index", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-general-"));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await mkdir(join(root, "specs"));
  await writeFile(join(root, "specs", "README.md"), "# specs\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
