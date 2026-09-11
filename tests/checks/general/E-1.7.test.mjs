import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/E-1.7.mjs";

test("rejects internal identifiers in inspectable files", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-internal-"));
  const file = join(root, "config.json");
  await writeFile(file, '{"value":"public"}\n');
  expect(await run({ root, files: [file] })).toMatchObject({ status: "pass" });
  await writeFile(file, `{"value":"/${["eliware", "internal"].join("-")}/config"}\n`);
  expect(await run({ root, files: [file] })).toMatchObject({ status: "fail" });
});
