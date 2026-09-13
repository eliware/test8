import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.6/E-1.6.0.mjs";

test("permits the example environment file and ignores generated directories", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-secrets-"));
  await mkdir(join(root, "node_modules"));
  await writeFile(join(root, ".env.example"), "SAFE=value\n");
  await writeFile(join(root, "node_modules", "secret.pem"), "ignored");
  await expect(run({ root })).resolves.toEqual({ ruleId: "E-1.6.0", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});

test("rejects credential and key artifacts", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-secrets-"));
  await writeFile(join(root, "credentials.json"), "secret");
  await expect(run({ root })).resolves.toEqual(expect.objectContaining({ status: "fail", message: expect.stringContaining("credentials.json") }));
  await rm(root, { recursive: true, force: true });
});
