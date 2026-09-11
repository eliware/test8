import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/E-1.6.mjs";

test("requires secret and dependency ignores", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-general-"));
  await writeFile(join(root, ".gitignore"), "node_modules\n.env\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, ".gitignore"), "node_modules\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
