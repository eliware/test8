import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/workspace/A-1.110.3.mjs";

test("validates schema fields and collection indexes", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-workspace-"));
  await mkdir(join(root, "records"));
  await writeFile(join(root, "records", "README.md"), "records.json\n");
  await writeFile(
    join(root, "records", "records.json"),
    JSON.stringify({ schema: { requiredFields: ["id"] }, items: [{ id: "one" }] }),
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(
    join(root, "records", "records.json"),
    JSON.stringify({ schema: { requiredFields: ["id", "owner"] }, items: [{ id: "one" }] }),
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
