import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/infrastructure/A-1.90.1.mjs";

test("requires infrastructure README topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-infra-"));
  await writeFile(
    join(root, "README.md"),
    "purpose managed targets requirements setup configuration desired state validation change security support license\n",
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "README.md"), "purpose\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
