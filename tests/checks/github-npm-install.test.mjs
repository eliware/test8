import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/A-1.24.2.mjs";

async function workflowRoot(name = "ci.yml") {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-npm-install-"));
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  return { root, workflow: join(root, ".github", "workflows", name) };
}

test.each(["npm ci", "npm install"])("accepts a workflow running %s", async (command) => {
  const { root, workflow } = await workflowRoot();
  await writeFile(workflow, `run: ${command}\n`);

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.2",
    status: "pass",
  });
});

test("rejects workflows without an npm dependency-install command", async () => {
  const { root, workflow } = await workflowRoot();
  await writeFile(workflow, "run: npm test\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.2",
    status: "fail",
    message: "CI workflows must install dependencies with npm.",
  });
});

test("ignores non-workflow files", async () => {
  const { root, workflow } = await workflowRoot("notes.txt");
  await writeFile(workflow, "npm ci\n");

  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});

test("rejects a missing workflows directory", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-npm-install-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.2",
    status: "fail",
    message: "A workflow is required.",
  });
});
