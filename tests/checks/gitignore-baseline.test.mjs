import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/A-1.22.1.mjs";

test("accepts a complete gitignore baseline", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-gitignore-"));
  await writeFile(
    join(root, ".gitignore"),
    "node_modules\n.git\ncoverage\nbuild\n.env\nruntime-state\n",
  );
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.22.1", status: "pass", message: "" });
});

test("rejects an incomplete gitignore baseline", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-gitignore-"));
  await writeFile(join(root, ".gitignore"), "node_modules .git\n");
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "A-1.22.1", status: "fail" });
});

test("rejects a missing gitignore", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-gitignore-"));
  await expect(run({ root })).resolves.toEqual({
    ruleId: "A-1.22.1",
    status: "fail",
    message: ".gitignore is required for repository hygiene enforcement.",
  });
});
