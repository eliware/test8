import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/E-1.8.mjs";

async function fixture(value, example = "MAILBOX_OWNER=placeholder\n") {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mailbox-"));
  await writeFile(join(root, ".env"), `ELIWARE_MAILBOX_OWNER=${value}\n`);
  await writeFile(join(root, ".env.example"), example);
  return root;
}

test("accepts the repository mailbox owner in local env only", async () => {
  const root = await fixture("test@eliware.org");
  await expect(run({ root, packageJson: { name: "@eliware/test" } })).resolves.toMatchObject({
    ruleId: "E-1.8",
    status: "pass",
  });
});

test("rejects a missing or incorrect mailbox owner", async () => {
  const root = await fixture("wrong@eliware.org");
  await expect(run({ root, packageJson: { name: "@eliware/test" } })).resolves.toMatchObject({
    ruleId: "E-1.8",
    status: "fail",
  });
});

test("rejects publishing the mailbox owner through the env template", async () => {
  const root = await fixture("test@eliware.org", "ELIWARE_MAILBOX_OWNER=test@eliware.org\n");
  await expect(run({ root, packageJson: { name: "@eliware/test" } })).resolves.toMatchObject({
    ruleId: "E-1.8",
    status: "fail",
  });
});

test("rejects missing identity, local env, and owner assignment", async () => {
  const root = await fixture("test@eliware.org");
  await expect(run({ root, packageJson: {} })).resolves.toMatchObject({ status: "fail" });
  await expect(
    run({ root: `${root}-missing`, packageJson: { name: "@eliware/test" } }),
  ).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, ".env"), "PORT=3000\n");
  await expect(run({ root, packageJson: { name: "@eliware/test" } })).resolves.toMatchObject({
    status: "fail",
  });
});

test("allows a local owner when no template exists", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mailbox-no-example-"));
  await writeFile(join(root, ".env"), "MAILBOX_OWNER=test@eliware.org\n");
  await expect(run({ root, packageJson: { name: "@eliware/test" } })).resolves.toMatchObject({
    status: "pass",
  });
});
