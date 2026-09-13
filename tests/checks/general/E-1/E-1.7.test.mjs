import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/general/E-1/E-1.7.mjs";

test("rejects infrastructure-internal identifiers", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-internal-"));
  await writeFile(join(root, "config.json"), JSON.stringify({ host: ["db", "internal"].join(".") }));
  await expect(run({ root, files: ["config.json"] })).resolves.toEqual(expect.objectContaining({ status: "fail" }));
  await rm(root, { recursive: true, force: true });
});

test("accepts files without infrastructure-internal identifiers", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-public-"));
  await writeFile(join(root, "config.json"), JSON.stringify({ host: "localhost" }));
  await expect(run({ root, files: ["config.json"] })).resolves.toEqual({ ruleId: "E-1.7", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
