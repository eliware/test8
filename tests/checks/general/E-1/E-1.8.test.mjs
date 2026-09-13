import { expect, test } from "@jest/globals";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../src/checks/general/E-1/E-1.8.mjs";

test("requires the repository mailbox owner in local .env only", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-mailbox-"));
  const packageJson = { name: "@eliware/fixture" };
  await expect(run({ root, packageJson })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, ".env"), "MAILBOX_OWNER=fixture@eliware.org\n");
  await expect(run({ root, packageJson })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, ".env.example"), "MAILBOX_OWNER=fixture@eliware.org\n");
  await expect(run({ root, packageJson })).resolves.toMatchObject({ status: "fail" });
  await rm(root, { recursive: true, force: true });
});
