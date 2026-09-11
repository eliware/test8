import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/E-1.6.1.mjs";

test("passes when no backup or runtime-state files are present", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-backups-"));
  await writeFile(join(root, "README.md"), "safe\n");
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "E-1.6.1", status: "pass" });
});

test("fails when a backup artifact is present", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-backups-"));
  await writeFile(join(root, "production.dump"), "not a real dump\n");
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "E-1.6.1", status: "fail" });
});
