import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/web/A-1.50.3.mjs";

test("requires web README topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-web-"));
  await writeFile(
    join(root, "README.md"),
    "purpose requirements setup configuration routes assets ports usage browser operations security support license\n",
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "README.md"), "purpose\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
