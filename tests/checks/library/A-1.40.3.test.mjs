import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/library/A-1.40.3.mjs";

test("requires library README topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-library-"));
  await writeFile(
    join(root, "README.md"),
    "purpose requirements setup configuration usage api validation packaging security support license examples\n",
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "README.md"), "purpose\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
