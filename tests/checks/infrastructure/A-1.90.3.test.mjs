import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/infrastructure/A-1.90.3.mjs";

test("rejects invalid JSON records", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-json-"));
  await writeFile(join(root, "state.json"), "{}\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "state.json"), "not-json\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
