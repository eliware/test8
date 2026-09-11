import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/A-1.24.3.mjs";

async function workflowRoot(name = "ci.yml") {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-npm-test-"));
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  return { root, workflow: join(root, ".github", "workflows", name) };
}

test("accepts a workflow running npm test", async () => {
  const { root, workflow } = await workflowRoot();
  await writeFile(workflow, "run: npm test\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.3",
    status: "pass",
  });
});

test("rejects workflows without npm test", async () => {
  const { root, workflow } = await workflowRoot();
  await writeFile(workflow, "run: npm run lint\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.3",
    status: "fail",
    message: "CI workflows must run npm test.",
  });
});

test("ignores non-workflow files", async () => {
  const { root, workflow } = await workflowRoot("notes.txt");
  await writeFile(workflow, "npm test\n");

  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});

test("rejects a missing workflows directory", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-npm-test-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.24.3",
    status: "fail",
    message: "A workflow is required.",
  });
});
