import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/workspace/E-1.110/A-1.110.3.mjs";

test("requires workspace README indexes", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-workspace-index-"));
  await mkdir(join(root, "runbooks"));
  await writeFile(join(root, "runbooks", "README.md"), "index");
  await writeFile(join(root, "README.md"), "runbooks/README.md");
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.110.3", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
