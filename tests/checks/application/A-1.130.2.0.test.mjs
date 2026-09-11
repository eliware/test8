import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/application/A-1.130.2.0.mjs";

test("requires application docs guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-app-"));
  await mkdir(join(root, "docs"));
  await writeFile(
    join(root, "docs", "README.md"),
    "setup configuration usage troubleshooting support\n",
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "docs", "README.md"), "setup\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
