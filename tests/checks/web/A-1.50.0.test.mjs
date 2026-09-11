import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/web/A-1.50.0.mjs";

test("requires web AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-web-"));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "AGENTS.md"), "# web\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
