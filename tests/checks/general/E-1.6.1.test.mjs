import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/E-1.6.1.mjs";

test("rejects prohibited backup and runtime-state files", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-files-"));
  await writeFile(join(root, "README.md"), "# repo\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "backup.sql"), "-- backup\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
