import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test } from "@jest/globals";
import { run as runWorkspaceAgents } from "../../src/checks/workspace/A-1.110.0.1.mjs";
import { run as runStructuredReadme } from "../../src/checks/workspace/A-1.110.0.2.mjs";
import { run as runRecoveryReadme } from "../../src/checks/workspace/A-1.110.0.3.mjs";
import { run as runWorkspaceReadme } from "../../src/checks/workspace/A-1.110.1.mjs";

const roots = [];
afterEach(async () =>
  Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))),
);
async function rootWith(agents, readme) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workspace-docs-"));
  roots.push(root);
  await writeFile(join(root, "AGENTS.md"), agents);
  await writeFile(join(root, "README.md"), readme);
  return root;
}

test("workspace documentation checks accept complete guidance and reject missing topics", async () => {
  const agents = "workspace role communication records validation";
  const readme =
    "json structured owner boundaries steps status priorities decisions handoffs purpose role authority records runbooks workflows communication validation security support recovery";
  const root = await rootWith(agents, readme);
  for (const check of [
    runWorkspaceAgents,
    runStructuredReadme,
    runRecoveryReadme,
    runWorkspaceReadme,
  ])
    await expect(check({ root })).resolves.toMatchObject({ status: "pass" });
  const bad = await rootWith("workspace", "purpose");
  for (const check of [
    runWorkspaceAgents,
    runStructuredReadme,
    runRecoveryReadme,
    runWorkspaceReadme,
  ])
    await expect(check({ root: bad })).resolves.toMatchObject({ status: "fail" });
});

test("workspace documentation checks report missing documents", async () => {
  const root = await rootWith("workspace role communication records validation", "purpose");
  await rm(join(root, "AGENTS.md"));
  await rm(join(root, "README.md"));
  for (const check of [
    runWorkspaceAgents,
    runStructuredReadme,
    runRecoveryReadme,
    runWorkspaceReadme,
  ])
    await expect(check({ root })).resolves.toMatchObject({ status: "fail" });
});
