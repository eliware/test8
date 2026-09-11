import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/A-1.24.0.mjs";

async function workflowRoot(workflowName = "ci.yml") {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workflow-"));
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  return { root, workflow: join(root, ".github", "workflows", workflowName) };
}

test("accepts a workflow validating pull requests and pushes", async () => {
  const { root, workflow } = await workflowRoot();
  await writeFile(workflow, "on: [pull_request, push]\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.0",
    status: "pass",
  });
});

test("rejects workflows without both required triggers", async () => {
  const { root, workflow } = await workflowRoot();
  await writeFile(workflow, "on: pull_request\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.0",
    status: "fail",
    message: "A workflow must validate pull requests and pushes.",
  });
});

test("ignores non-workflow files", async () => {
  const { root, workflow } = await workflowRoot("notes.txt");
  await writeFile(workflow, "pull_request push\n");

  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});

test("rejects a missing workflows directory", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workflow-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.0",
    status: "fail",
    message: "A GitHub Actions workflow is required.",
  });
});
