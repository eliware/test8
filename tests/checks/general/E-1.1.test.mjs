import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/E-1.1.mjs";

test("requires root README.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-general-"));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "README.md"), "# repository\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
