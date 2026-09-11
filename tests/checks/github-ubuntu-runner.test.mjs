import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/A-1.24.1.mjs";

async function workflowRoot(name = "ci.yml") {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-ubuntu-"));
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  return { root, workflow: join(root, ".github", "workflows", name) };
}

test("accepts a workflow using an Ubuntu runner", async () => {
  const { root, workflow } = await workflowRoot();
  await writeFile(workflow, "runs-on: ubuntu-latest\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.1",
    status: "pass",
  });
});

test("rejects workflows without an Ubuntu runner", async () => {
  const { root, workflow } = await workflowRoot();
  await writeFile(workflow, "runs-on: windows-latest\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.1",
    status: "fail",
    message: "CI workflows must run on Ubuntu.",
  });
});

test("ignores non-workflow files", async () => {
  const { root, workflow } = await workflowRoot("notes.txt");
  await writeFile(workflow, "ubuntu-latest\n");

  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});

test("rejects a missing workflows directory", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-ubuntu-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.1",
    status: "fail",
    message: "A workflow is required.",
  });
});
