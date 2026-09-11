import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/web/E-1.50.2.mjs";

test("requires web acceptance guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-web-"));
  await writeFile(join(root, "README.md"), "browser validation\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "README.md"), "browser\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
