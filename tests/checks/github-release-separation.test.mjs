import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/A-1.24.4.mjs";

const roots = [];

async function fixture(workflows) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workflows-"));
  roots.push(root);
  const directory = join(root, ".github", "workflows");
  await mkdir(directory, { recursive: true });
  for (const [name, content] of Object.entries(workflows)) {
    await writeFile(join(directory, name), content);
  }
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

test("passes when a validation workflow has no release job", async () => {
  const root = await fixture({ "ci.yml": "jobs:\n  test:\n    runs-on: ubuntu-latest\n" });
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.24.4", status: "pass", message: "" });
});

test.each(["publish", "deploy"])("fails when a workflow contains %s", async (keyword) => {
  const root = await fixture({ "ci.yml": `jobs:\n  release:\n    run: ${keyword}\n` });
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "A-1.24.4", status: "fail" });
});

test("ignores non-workflow files and fails when no workflow is usable", async () => {
  const root = await fixture({ "notes.txt": "publish is discussed here\n" });
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "A-1.24.4", status: "fail" });
});

test("fails when the workflows directory is absent", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workflows-"));
  roots.push(root);
  await expect(run({ root })).resolves.toEqual({
    ruleId: "A-1.24.4",
    status: "fail",
    message: "A workflow is required.",
  });
});
